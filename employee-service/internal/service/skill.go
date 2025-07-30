package service

import (
	"context"

	"employee-service/internal/models"
	neo4jrepo "employee-service/internal/repository/neo4j"
	"employee-service/internal/repository/postgres"
)

type SkillService struct {
	PG  *postgres.EmployeeRepo
	GDB *neo4jrepo.SkillsRepo
}

func (s *SkillService) UpsertEmployeeSkills(ctx context.Context, empID string, skills []models.Skill) error {
	return s.GDB.UpsertEmployeeSkills(ctx, empID, skills)
}

func (s *SkillService) AddCertification(ctx context.Context, cert *models.Certification) error {
	return s.PG.AddCertification(ctx, cert)
}
