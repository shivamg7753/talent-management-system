const express = require('express');
const axios = require('axios');
const router = express.Router();

// Config
const EMPLOYEE_SERVICE_URL = process.env.EMPLOYEE_SERVICE_URL || 'http://employee-service:8083';

// Error handler for async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all employees
router.get('/', asyncHandler(async (req, res) => {
  const response = await axios.get(`${EMPLOYEE_SERVICE_URL}/employees`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Get employee by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const response = await axios.get(`${EMPLOYEE_SERVICE_URL}/employees/${req.params.id}`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Create new employee
router.post('/', asyncHandler(async (req, res) => {
  const response = await axios.post(`${EMPLOYEE_SERVICE_URL}/employees`, req.body, {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    }
  });
  res.status(201).json(response.data);
}));

// Update employee
router.put('/:id', asyncHandler(async (req, res) => {
  const response = await axios.put(`${EMPLOYEE_SERVICE_URL}/employees/${req.params.id}`, req.body, {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    }
  });
  res.json(response.data);
}));

// Delete employee
router.delete('/:id', asyncHandler(async (req, res) => {
  const response = await axios.delete(`${EMPLOYEE_SERVICE_URL}/employees/${req.params.id}`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Get employee skills
router.get('/:id/skills', asyncHandler(async (req, res) => {
  const response = await axios.get(`${EMPLOYEE_SERVICE_URL}/employees/${req.params.id}/skills`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Add skill to employee
router.post('/:id/skills', asyncHandler(async (req, res) => {
  const response = await axios.post(`${EMPLOYEE_SERVICE_URL}/employees/${req.params.id}/skills`, req.body, {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    }
  });
  res.status(201).json(response.data);
}));

// Find employees by skills
router.post('/search/skills', asyncHandler(async (req, res) => {
  const response = await axios.post(`${EMPLOYEE_SERVICE_URL}/employees/search/skills`, req.body, {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    }
  });
  res.json(response.data);
}));

module.exports = router;