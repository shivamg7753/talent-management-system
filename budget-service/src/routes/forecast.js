// src/routes/forecast.js
const express = require('express');
const router = express.Router();
const { simulate } = require('../forecasting/monte-carlo');
const Budget = require('../models/Budget');

// GET /forecast/:id - Get forecast for specific budget
router.get('/forecast/:id', async (req, res) => {
  try {
    const budgetId = req.params.id;
    const budget = await Budget.findByPk(budgetId);
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Generate forecast based on budget data
    const result = simulate({
      base: Number(budget.total),
      variabilityPct: 20, // 20% variability
      runs: 1000,
      floor: 0,
      cap: Number(budget.total) * 1.5, // Cap at 150% of budget
    });

    res.json({
      budgetId: budget.id,
      budgetName: budget.name,
      currentTotal: budget.total,
      currentSpent: budget.spent,
      forecast: result
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/forecast', (req, res) => {
  try {
    const { base, variabilityPct, runs, floor, cap } = req.body || {};
    const result = simulate({
      base: Number(base),
      variabilityPct: variabilityPct ? Number(variabilityPct) : undefined,
      runs: runs ? Number(runs) : undefined,
      floor: floor !== undefined ? Number(floor) : undefined,
      cap: cap !== undefined ? Number(cap) : undefined,
    });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
