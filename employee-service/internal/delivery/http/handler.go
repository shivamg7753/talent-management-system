package http

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"employee-service/internal/models"
	"employee-service/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type Handler struct {
	Skills  *service.SkillService
	Matcher *service.MatcherService
}

func NewRouter(h *Handler) *gin.Engine {
	r := gin.Default()

	// Health
	r.GET("/healthz", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Create employee (basic record in PG) + optional skills in graph
	r.POST("/employees", func(c *gin.Context) {
		var req struct {
			ID       string         `json:"id"`
			Name     string         `json:"name"`
			Projects []string       `json:"projects"`
			Skills   []models.Skill `json:"skills"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		emp := &models.Employee{
			ID:       req.ID,
			Name:     req.Name,
			Projects: pq.StringArray(req.Projects),
		}
		ctx := context.Background()
		if err := h.Skills.PG.CreateEmployee(ctx, emp); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create employee"})
			return
		}
		if len(req.Skills) > 0 {
			if err := h.Skills.UpsertEmployeeSkills(ctx, emp.ID, req.Skills); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upsert skills"})
				return
			}
		}
		c.JSON(http.StatusCreated, emp)
	})

	// Find employees by skills: GET /employees?skills=go,python&min_level=5
	r.GET("/employees", func(c *gin.Context) {
		skills := c.Query("skills")
		minLevel, _ := strconv.Atoi(c.DefaultQuery("min_level", "0"))
		ctx := context.Background()

		emps, err := h.Matcher.FindEmployeesBySkills(ctx, skills, minLevel)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed"})
			return
		}
		c.JSON(http.StatusOK, emps)
	})

	// Upsert employee skills
	r.POST("/employees/:id/skills", func(c *gin.Context) {
		id := c.Param("id")
		var body struct {
			Skills []models.Skill `json:"skills"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := h.Skills.UpsertEmployeeSkills(c, id, body.Skills); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update skills"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "skills updated"})
	})

	// Add certification (competency tracking)
	r.POST("/employees/:id/certifications", func(c *gin.Context) {
		id := c.Param("id")
		var body struct {
			Name       string    `json:"name"`
			Level      string    `json:"level"`
			Issuer     string    `json:"issuer"`
			AchievedAt time.Time `json:"achieved_at"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		cert := &models.Certification{
			EmployeeID: id,
			Name:       body.Name,
			Level:      body.Level,
			Issuer:     body.Issuer,
			AchievedAt: body.AchievedAt,
		}
		if err := h.Skills.AddCertification(c, cert); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add certification"})
			return
		}
		c.JSON(http.StatusCreated, cert)
	})

	// Team Gap Analysis
	// POST /teams/analyze
	// body: { "team_ids":["emp1","emp2"], "requirements":[{"name":"go","min_level":6,"count_need":2}] }
	r.POST("/teams/analyze", func(c *gin.Context) {
		var body struct {
			TeamIDs      []string                  `json:"team_ids"`
			Requirements []models.SkillRequirement `json:"requirements"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		rep, err := h.Matcher.TeamGapAnalysis(c, body.TeamIDs, body.Requirements)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "analysis failed"})
			return
		}
		c.JSON(http.StatusOK, rep)
	})

	return r
}
