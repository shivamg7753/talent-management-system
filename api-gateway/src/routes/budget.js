const express = require('express');
const axios = require('axios');
const router = express.Router();

// Config
const BUDGET_SERVICE_URL = process.env.BUDGET_SERVICE_URL || 'http://budget-service:8082';

// Error handler for async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all budgets
router.get('/', asyncHandler(async (req, res) => {
  const response = await axios.get(`${BUDGET_SERVICE_URL}/budgets`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Get budget by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const response = await axios.get(`${BUDGET_SERVICE_URL}/budgets/${req.params.id}`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Create new budget
router.post('/', asyncHandler(async (req, res) => {
  const response = await axios.post(`${BUDGET_SERVICE_URL}/budgets`, req.body, {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    }
  });
  res.status(201).json(response.data);
}));

// Update budget
router.put('/:id', asyncHandler(async (req, res) => {
  const response = await axios.put(`${BUDGET_SERVICE_URL}/budgets/${req.params.id}`, req.body, {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    }
  });
  res.json(response.data);
}));

// Delete budget
router.delete('/:id', asyncHandler(async (req, res) => {
  const response = await axios.delete(`${BUDGET_SERVICE_URL}/budgets/${req.params.id}`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Get budget forecasts
router.get('/forecasts/:projectId', asyncHandler(async (req, res) => {
  const response = await axios.get(`${BUDGET_SERVICE_URL}/forecasts/${req.params.projectId}`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Get budget monitoring data
router.get('/monitoring/:projectId', asyncHandler(async (req, res) => {
  const response = await axios.get(`${BUDGET_SERVICE_URL}/monitoring/${req.params.projectId}`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

module.exports = router;