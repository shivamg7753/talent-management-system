# All-in-One Talent & Budget Tracker

A unified platform to manage the entire recruitment lifecycle, dynamically track employee skillsets for better project assignments, and forecast and monitor budgets for complex deals.

## Architecture Overview

This project follows a microservices architecture with the following components:

### Services

1. **API Gateway** - Entry point for all client requests, handles routing to appropriate services
   - Port: 8080
   - Technologies: Node.js, Express
   - Responsibilities: Request routing, authentication verification, logging

2. **Auth Service** - Handles user authentication and authorization
   - Port: 8081
   - Technologies: Go
   - Responsibilities: User registration, login, token validation

3. **Budget Service** - Manages budget tracking and forecasting
   - Port: 8082
   - Technologies: Node.js, Express, Sequelize
   - Responsibilities: Budget creation, monitoring, forecasting

4. **Employee Service** - Manages employee data and skills
   - Port: 8083
   - Technologies: Go
   - Responsibilities: Employee profiles, skill tracking, skill-based search

5. **Recruitment Service** - Handles the recruitment process
   - Port: 8084
   - Technologies: Python, Flask
   - Responsibilities: Job postings, applications, resume parsing with AI, evaluations

6. **Frontend** - User interface
   - Port: 3000
   - Technologies: React, TypeScript
   - Responsibilities: User interface for all features

### Databases

1. **PostgreSQL** - Primary relational database for most services
   - Port: 5435:5432
   - Used by: Auth Service, Budget Service, Recruitment Service

2. **Neo4j** - Graph database for employee skills and relationships
   - Ports: 7474 (Browser), 7687 (Bolt)
   - Used by: Employee Service

## Service Communication

### REST API

Services communicate with each other through REST APIs. The API Gateway routes client requests to the appropriate service.

### gRPC (Planned)

The project includes proto files for future gRPC implementation, which will enable more efficient service-to-service communication.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Go (for local development)
- Python (for local development)

### Running the Application

1. Clone the repository

```bash
git clone <repository-url>
cd talent-budget-tracker
```

2. Start the services using Docker Compose

```bash
docker-compose up -d
```

3. Access the application
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8080
   - Swagger Documentation: http://localhost:8080/api-docs

## Development

### Adding a New Service

1. Create a new directory for your service
2. Add the service to docker-compose.yml
3. Create a route in the API Gateway
4. Update the proto files if using gRPC

### Environment Variables

Each service has its own .env file for configuration. See the .env.example files in each service directory for required variables.

## License

This project is licensed under the MIT License - see the LICENSE file for details.