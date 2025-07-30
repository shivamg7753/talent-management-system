package model

import "time"

type User struct {
    ID             uint      `gorm:"primaryKey"`
    Email          string    `gorm:"unique;not null"`
    HashedPassword string    `gorm:"not null"`
    Roles          string    `gorm:"not null"` // "Admin,HR"
    CreatedAt      time.Time
}
