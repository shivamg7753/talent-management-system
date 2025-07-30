const express = require('express');
const router = express.Router();
const axios = require('axios');

const BUDGET_SERVICE_URL = process.env.BUDGET_SERVICE_URL || 'http://budget-service:8082';

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BUDGET_SERVICE_URL}/budgets`);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling budget service:', error.message);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Get budget by ID
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${BUDGET_SERVICE_URL}/budgets/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling budget service:', error.message);
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
});

// Create budget
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${BUDGET_SERVICE_URL}/budgets`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling budget service:', error.message);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// Get forecast
router.get('/forecast/:id', async (req, res) => {
  try {
    const response = await axios.get(`${BUDGET_SERVICE_URL}/forecast/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling budget service:', error.message);
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
});

module.exports = router;
