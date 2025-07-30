const express = require('express');
const router = express.Router();
const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:8081';

// Login
router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/login`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling auth service:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/register`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling auth service:', error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = router; 