package postgres

import (
	"context"

	"employee-service/internal/models"
	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type EmployeeRepo struct {
	DB *gorm.DB
}

func NewEmployeeRepo(dsn string) (*EmployeeRepo, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	// Auto-migrate PG tables
	if err := db.AutoMigrate(&models.Employee{}, &models.Certification{}); err != nil {
		return nil, err
	}
	return &EmployeeRepo{DB: db}, nil
}

func (r *EmployeeRepo) CreateEmployee(ctx context.Context, e *models.Employee) error {
	if e.ID == "" {
		e.ID = uuid.NewString()
	}
	return r.DB.WithContext(ctx).Create(e).Error
}

func (r *EmployeeRepo) GetEmployeesByIDs(ctx context.Context, ids []string) ([]models.Employee, error) {
	var list []models.Employee
	if len(ids) == 0 {
		return list, nil
	}
	if err := r.DB.WithContext(ctx).Where("id IN ?", ids).Preload("Certifications").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *EmployeeRepo) ListAll(ctx context.Context) ([]models.Employee, error) {
	var list []models.Employee
	if err := r.DB.WithContext(ctx).Preload("Certifications").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *EmployeeRepo) AddCertification(ctx context.Context, c *models.Certification) error {
	if c.ID == "" {
		c.ID = uuid.NewString()
	}
	return r.DB.WithContext(ctx).Create(c).Error
}
