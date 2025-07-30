package service

import (
	"context"
	"strings"

	"employee-service/internal/models"
	neo4jrepo "employee-service/internal/repository/neo4j"
	"employee-service/internal/repository/postgres"
)

type MatcherService struct {
	PG  *postgres.EmployeeRepo
	GDB *neo4jrepo.SkillsRepo
}

// ----------------------------------------
// Find employees by skill list
// ----------------------------------------
func (m *MatcherService) FindEmployeesBySkills(ctx context.Context, skillsCSV string, minLevel int) ([]models.Employee, error) {
	// CSV ko []string me tod do (go, python)
	raw := strings.Split(skillsCSV, ",")
	var skills []string
	for _, s := range raw {
		ss := strings.TrimSpace(s)
		if ss != "" {
			skills = append(skills, ss)
		}
	}

	// If no skills provided, return empty array instead of nil
	if len(skills) == 0 {
		return []models.Employee{}, nil
	}

	// Neo4j me query kar ke employee IDs nikaalo
	ids, err := m.GDB.FindEmployeesBySkills(ctx, skills, minLevel)
	if err != nil {
		return nil, err
	}

	// Postgres se full employee records fetch karo
	return m.PG.GetEmployeesByIDs(ctx, ids)
}

// ----------------------------------------
// Team gap analysis
// ----------------------------------------
func (m *MatcherService) TeamGapAnalysis(ctx context.Context, teamIDs []string, reqs []models.SkillRequirement) (*neo4jrepo.GapReport, error) {
	return m.GDB.TeamGapAnalysis(ctx, teamIDs, reqs)
}
