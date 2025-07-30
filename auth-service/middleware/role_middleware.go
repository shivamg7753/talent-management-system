package middleware

import (
	"auth-service/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// RequireRoles checks if user has at least one of the allowed roles
func RequireRoles(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := utils.ValidateJWT(tokenStr)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			c.Abort()
			return
		}

		// Check role match
		hasRole := false
		for _, userRole := range claims.Roles {
			for _, allowed := range allowedRoles {
				if userRole == allowed {
					hasRole = true
					break
				}
			}
		}

		if !hasRole {
			c.JSON(http.StatusForbidden, gin.H{"error": "access denied: insufficient role"})
			c.Abort()
			return
		}

		c.Set("user", claims)
		c.Next()
	}
}
