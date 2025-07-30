package model

import "time"

type AuditLog struct {
	ID        uint      `gorm:"primaryKey"`
	Action    string
	UserEmail string
	CreatedAt time.Time
}
