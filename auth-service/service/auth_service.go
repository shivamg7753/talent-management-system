package service

import (
	"auth-service/model"
	"auth-service/utils"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	DB *gorm.DB
}

// Register user with roles as JSON array
func (s *AuthService) Register(email, password string, roles []string) error {
	// Hash password
	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	// Convert roles slice to JSON
	rolesJSON, err := json.Marshal(roles)
	if err != nil {
		return err
	}

	// Create user struct
	user := model.User{
		Email:          email,
		HashedPassword: string(hashed),
		Roles:          string(rolesJSON), // Store as JSONB
	}

	// Insert into DB
	return s.DB.Create(&user).Error
}

// Login user and generate token
func (s *AuthService) Login(email, password string) (string, error) {
	var user model.User

	// Find user by email
	if err := s.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return "", err
	}

	// Compare password
	if err := bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(password)); err != nil {
		return "", err
	}

	// Unmarshal roles JSON into []string
	var roles []string
	_ = json.Unmarshal([]byte(user.Roles), &roles)

	// Generate JWT with roles
	token, _ := utils.GenerateJWT(user.ID, user.Email, roles)

	// Save audit log
	s.DB.Create(&model.AuditLog{
		Action:    "login",
		UserEmail: user.Email,
	})

	return token, nil
}
