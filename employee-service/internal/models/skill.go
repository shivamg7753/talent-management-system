package models

// Skill node/edge payloads for Neo4j
type Skill struct {
	Name  string `json:"name"`  // e.g., "Go"
	Level int    `json:"level"` // 1..10
}

// For team gap analysis requirements
type SkillRequirement struct {
	Name      string `json:"name"`
	MinLevel  int    `json:"min_level"`
	CountNeed int    `json:"count_need"` // how many people meeting MinLevel required
}
