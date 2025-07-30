const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

// Import routes
const budgetRoutes = require('./routes/budget');
const employeeRoutes = require('./routes/employee');
const recruitmentRoutes = require('./routes/recruitment');

// Config
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:8081';
const BUDGET_SERVICE_URL = process.env.BUDGET_SERVICE_URL || 'http://budget-service:8082';
const EMPLOYEE_SERVICE_URL = process.env.EMPLOYEE_SERVICE_URL || 'http://employee-service:8083';
const RECRUITMENT_SERVICE_URL = process.env.RECRUITMENT_SERVICE_URL || 'http://recruitment-service:8084';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Direct proxy to Auth Service for login/register
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/auth'
  }
}));

// Protected routes using our custom route handlers
app.use('/api/budget', verifyToken, budgetRoutes);
app.use('/api/employees', verifyToken, employeeRoutes);
app.use('/api/recruitment', verifyToken, recruitmentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

module.exports = app; // For testing