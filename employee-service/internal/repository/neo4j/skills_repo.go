package neo4jrepo

import (
	"context"
	"errors"

	"employee-service/internal/models"
	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
)

type SkillsRepo struct {
	Driver neo4j.DriverWithContext
}

func NewSkillsRepo(uri, user, pass string) (*SkillsRepo, error) {
	dr, err := neo4j.NewDriverWithContext(uri, neo4j.BasicAuth(user, pass, ""))
	if err != nil {
		return nil, err
	}
	return &SkillsRepo{Driver: dr}, nil
}

func (r *SkillsRepo) Close(ctx context.Context) error {
	if r.Driver == nil {
		return nil
	}
	return r.Driver.Close(ctx)
}

// Upsert skills for an employee in graph:
// (:Employee {id})-[:HAS_SKILL {level}]->(:Skill {name})
func (r *SkillsRepo) UpsertEmployeeSkills(ctx context.Context, empID string, skills []models.Skill) error {
	if empID == "" {
		return errors.New("empty employee id")
	}
	sess := r.Driver.NewSession(ctx, neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
	defer sess.Close(ctx)

	_, err := sess.ExecuteWrite(ctx, func(tx neo4j.ManagedTransaction) (any, error) {
		// Ensure Employee node exists
		_, err := tx.Run(ctx,
			`MERGE (e:Employee {id: $id}) RETURN e`, map[string]any{"id": empID})
		if err != nil {
			return nil, err
		}
		// Upsert skills
		for _, s := range skills {
			_, err = tx.Run(ctx, `
				MERGE (sk:Skill {name: toLower($name)})
				MERGE (e:Employee {id: $empId})
				MERGE (e)-[r:HAS_SKILL]->(sk)
				SET r.level = $level
			`, map[string]any{"name": s.Name, "level": s.Level, "empId": empID})
			if err != nil {
				return nil, err
			}
		}
		return nil, nil
	})
	return err
}

// Find employees who have ALL requested skills (case-insensitive).
// minLevel optional (if 0, ignore).
func (r *SkillsRepo) FindEmployeesBySkills(ctx context.Context, skills []string, minLevel int) ([]string, error) {
	if len(skills) == 0 {
		return []string{}, nil
	}
	sess := r.Driver.NewSession(ctx, neo4j.SessionConfig{AccessMode: neo4j.AccessModeRead})
	defer sess.Close(ctx)

	result, err := sess.ExecuteRead(ctx, func(tx neo4j.ManagedTransaction) (any, error) {
		q := `
		WITH $skills AS skills, $min AS minlvl
		MATCH (e:Employee)-[r:HAS_SKILL]->(s:Skill)
		WHERE toLower(s.name) IN [x IN skills | toLower(x)]
		  AND (minlvl = 0 OR r.level >= minlvl)
		WITH e.id AS id, collect(DISTINCT toLower(s.name)) AS got
		WHERE size(got) = size([x IN skills | toLower(x)])
		RETURN id
		`
		rows, err := tx.Run(ctx, q, map[string]any{
			"skills": skills,
			"min":    minLevel,
		})
		if err != nil {
			return nil, err
		}
		var ids []string
		for rows.Next(ctx) {
			var id string
			val, ok := rows.Record().Values[0].(string)
			if !ok {
				continue // skip if not a string
			}
			id = val
			ids = append(ids, id)
		}
		return ids, rows.Err()
	})
	if err != nil {
		return nil, err
	}
	return result.([]string), nil
}

// Team gap analysis: for required skills, compute coverage and missing counts.
type GapReport struct {
	Coverage map[string]int `json:"coverage"` // skill -> count meeting min level
	Missing  map[string]int `json:"missing"`  // skill -> how many still needed
}

func (r *SkillsRepo) TeamGapAnalysis(ctx context.Context, teamIDs []string, reqs []models.SkillRequirement) (*GapReport, error) {
	rep := &GapReport{
		Coverage: map[string]int{},
		Missing:  map[string]int{},
	}
	if len(teamIDs) == 0 || len(reqs) == 0 {
		return rep, nil
	}

	sess := r.Driver.NewSession(ctx, neo4j.SessionConfig{AccessMode: neo4j.AccessModeRead})
	defer sess.Close(ctx)

	for _, req := range reqs {
		data, err := sess.ExecuteRead(ctx, func(tx neo4j.ManagedTransaction) (any, error) {
			q := `
			MATCH (e:Employee)-[r:HAS_SKILL]->(s:Skill {name: toLower($name)})
			WHERE e.id IN $team AND r.level >= $minlvl
			RETURN count(DISTINCT e.id) AS c
			`
			row, err := tx.Run(ctx, q, map[string]any{
				"name":   req.Name,
				"minlvl": req.MinLevel,
				"team":   teamIDs,
			})
			if err != nil {
				return 0, err
			}
			if row.Next(ctx) {
				return int(row.Record().Values[0].(int64)), nil
			}
			return 0, row.Err()
		})
		if err != nil {
			return nil, err
		}
		cov := data.(int)
		rep.Coverage[req.Name] = cov
		miss := req.CountNeed - cov
		if miss < 0 {
			miss = 0
		}
		rep.Missing[req.Name] = miss
	}
	return rep, nil
}
