const express = require('express');
const router = express.Router();
const axios = require('axios');

const EMPLOYEE_SERVICE_URL = process.env.EMPLOYEE_SERVICE_URL || 'http://employee-service:8083';

// Get all employees
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${EMPLOYEE_SERVICE_URL}/employees`);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling employee service:', error.message);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${EMPLOYEE_SERVICE_URL}/employees/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling employee service:', error.message);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create employee
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${EMPLOYEE_SERVICE_URL}/employees`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling employee service:', error.message);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

module.exports = router;
