const express = require('express');
const axios = require('axios');
const router = express.Router();

// Config
const RECRUITMENT_SERVICE_URL = process.env.RECRUITMENT_SERVICE_URL || 'http://recruitment-service:8084';

// Error handler for async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get all job postings
router.get('/jobs', asyncHandler(async (req, res) => {
  const response = await axios.get(`${RECRUITMENT_SERVICE_URL}/jobs`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Get job posting by ID
router.get('/jobs/:id', asyncHandler(async (req, res) => {
  const response = await axios.get(`${RECRUITMENT_SERVICE_URL}/jobs/${req.params.id}`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Create new job posting
router.post('/jobs', asyncHandler(async (req, res) => {
  const response = await axios.post(`${RECRUITMENT_SERVICE_URL}/jobs`, req.body, {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    }
  });
  res.status(201).json(response.data);
}));

// Update job posting
router.put('/jobs/:id', asyncHandler(async (req, res) => {
  const response = await axios.put(`${RECRUITMENT_SERVICE_URL}/jobs/${req.params.id}`, req.body, {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    }
  });
  res.json(response.data);
}));

// Delete job posting
router.delete('/jobs/:id', asyncHandler(async (req, res) => {
  const response = await axios.delete(`${RECRUITMENT_SERVICE_URL}/jobs/${req.params.id}`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Get all applications
router.get('/applications', asyncHandler(async (req, res) => {
  const response = await axios.get(`${RECRUITMENT_SERVICE_URL}/applications`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Get application by ID
router.get('/applications/:id', asyncHandler(async (req, res) => {
  const response = await axios.get(`${RECRUITMENT_SERVICE_URL}/applications/${req.params.id}`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Create new application
router.post('/applications', asyncHandler(async (req, res) => {
  const response = await axios.post(`${RECRUITMENT_SERVICE_URL}/applications`, req.body, {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    }
  });
  res.status(201).json(response.data);
}));

// Update application status
router.put('/applications/:id/status', asyncHandler(async (req, res) => {
  const response = await axios.put(`${RECRUITMENT_SERVICE_URL}/applications/${req.params.id}/status`, req.body, {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    }
  });
  res.json(response.data);
}));

// Parse resume with AI
router.post('/resume/parse', asyncHandler(async (req, res) => {
  const response = await axios.post(`${RECRUITMENT_SERVICE_URL}/resume/parse`, req.body, {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    }
  });
  res.json(response.data);
}));

// Get evaluation results
router.get('/evaluations/:applicationId', asyncHandler(async (req, res) => {
  const response = await axios.get(`${RECRUITMENT_SERVICE_URL}/evaluations/${req.params.applicationId}`, {
    headers: {
      'Authorization': req.headers.authorization
    }
  });
  res.json(response.data);
}));

// Create evaluation
router.post('/evaluations', asyncHandler(async (req, res) => {
  const response = await axios.post(`${RECRUITMENT_SERVICE_URL}/evaluations`, req.body, {
    headers: {
      'Authorization': req.headers.authorization,
      'Content-Type': 'application/json'
    }
  });
  res.status(201).json(response.data);
}));

module.exports = router;