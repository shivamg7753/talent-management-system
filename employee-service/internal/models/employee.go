package models

import (
	"time"

	"github.com/lib/pq"
)

type Employee struct {
	ID             string          `json:"id" gorm:"type:uuid;primaryKey"`
	Name           string          `json:"name"`
	Projects       pq.StringArray  `gorm:"type:text[]" json:"projects"`
	Certifications []Certification `json:"certifications" gorm:"foreignKey:EmployeeID"`
	CreatedAt      time.Time       `json:"created_at"`
	UpdatedAt      time.Time       `json:"updated_at"`
}

type Certification struct {
	ID         string    `json:"id" gorm:"type:uuid;primaryKey"`
	EmployeeID string    `json:"employee_id" gorm:"index"`
	Name       string    `json:"name"`
	Level      string    `json:"level"`  // e.g., Associate/Professional/Expert
	Issuer     string    `json:"issuer"` // e.g., AWS, GCP
	AchievedAt time.Time `json:"achieved_at"`
}
