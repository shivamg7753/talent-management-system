package main

import (
	"auth-service/config"
	"auth-service/controller"
	"auth-service/middleware"
	"auth-service/service"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	config.ConnectDB()

	authService := &service.AuthService{DB: config.DB}
	authController := &controller.AuthController{Service: authService}

	r := gin.Default()

	// Public routes
	r.POST("/register", authController.Register)
	r.POST("/login", authController.Login)

	// Protected routes
	admin := r.Group("/admin")
	admin.Use(middleware.RequireRoles("Admin"))
	{
		admin.GET("/dashboard", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "Welcome Admin Dashboard"})
		})
	}

	hr := r.Group("/hr")
	hr.Use(middleware.RequireRoles("HR"))
	{
		hr.GET("/panel", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "Welcome HR Panel"})
		})
	}

	manager := r.Group("/manager")
	manager.Use(middleware.RequireRoles("Manager", "Admin"))
	{
		manager.GET("/reports", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "Manager Reports Access"})
		})
	}

	r.Run(":8081")
}
