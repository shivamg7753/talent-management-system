// Configuration for API Gateway

module.exports = {
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://auth-service:8081',
    budget: process.env.BUDGET_SERVICE_URL || 'http://budget-service:8082',
    employee: process.env.EMPLOYEE_SERVICE_URL || 'http://employee-service:8083',
    recruitment: process.env.RECRUITMENT_SERVICE_URL || 'http://recruitment-service:8084'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};