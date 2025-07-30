const express = require('express');
const router = express.Router();
const axios = require('axios');

const RESUME_SCREENING_SERVICE_URL = process.env.RESUME_SCREENING_SERVICE_URL || 'http://resume-screening-service:8084';

// Batch resume screening
router.get('/batch-screen', async (req, res) => {
  try {
    const response = await axios.get(`${RESUME_SCREENING_SERVICE_URL}/batch_screen`);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling resume screening service:', error.message);
    res.status(500).json({ error: 'Failed to process resume screening' });
  }
});

// Get all database records
router.get('/candidates', async (req, res) => {
  try {
    const response = await axios.get(`${RESUME_SCREENING_SERVICE_URL}/database`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching candidates:', error.message);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// Get specific candidate by ID
router.get('/candidates/:id', async (req, res) => {
  try {
    const response = await axios.get(`${RESUME_SCREENING_SERVICE_URL}/database/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching candidate:', error.message);
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
});

// Reset database
router.post('/reset-database', async (req, res) => {
  try {
    const response = await axios.post(`${RESUME_SCREENING_SERVICE_URL}/reset_database`);
    res.json(response.data);
  } catch (error) {
    console.error('Error resetting database:', error.message);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

module.exports = router;
