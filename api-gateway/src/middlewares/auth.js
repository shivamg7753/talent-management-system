const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Middleware to verify JWT token
 */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * Middleware to check if user has required role
 */
const hasRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.roles && req.user.roles.includes(role)) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
  };
};

module.exports = {
  verifyToken,
  hasRole
};