// src/routes/forecast.js
const express = require('express');
const router = express.Router();
const { simulate } = require('../forecasting/monte-carlo');

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
