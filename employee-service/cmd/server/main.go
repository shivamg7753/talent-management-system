package main

import (
	"log"
	"os"

	httpd "employee-service/internal/delivery/http"
	neo4jrepo "employee-service/internal/repository/neo4j"
	"employee-service/internal/repository/postgres"
	"employee-service/internal/service"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	// Env vars
	pgDSN := getEnv("POSTGRES_DSN", "postgres://postgres:password@db:5432/talent_budget_tracker?sslmode=disable")
	neo4jURI := getEnv("NEO4J_URI", "neo4j://neo4j:7687")
	neo4jUser := getEnv("NEO4J_USER", "neo4j")
	neo4jPass := getEnv("NEO4J_PASSWORD", "password")
	port := getEnv("PORT", "8083")

	// Repos
	pgRepo, err := postgres.NewEmployeeRepo(pgDSN)
	if err != nil {
		log.Fatalf("pg connect: %v", err)
	}
	gRepo, err := neo4jrepo.NewSkillsRepo(neo4jURI, neo4jUser, neo4jPass)
	if err != nil {
		log.Fatalf("neo4j connect: %v", err)
	}
	defer gRepo.Close(nil)

	// Services
	skillSvc := &service.SkillService{PG: pgRepo, GDB: gRepo}
	matchSvc := &service.MatcherService{PG: pgRepo, GDB: gRepo}

	// HTTP
	h := &httpd.Handler{Skills: skillSvc, Matcher: matchSvc}
	r := httpd.NewRouter(h)

	log.Printf("Employee Service listening on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}

func getEnv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
