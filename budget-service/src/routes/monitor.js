// src/routes/monitor.js
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { addClient, notify } = require('../monitoring/alerts');
const { burnRate } = require('../monitoring/burn-rate');

// GET /budgets/:id/alert  (Server-Sent Events)
router.get('/budgets/:id/alert', async (req, res) => {
  const { id } = req.params;

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // register client
  addClient(id, res);

  // initial push
  const b = await Budget.findByPk(id);
  if (!b) {
    res.write(`event: error\ndata: ${JSON.stringify({ message: 'Budget not found' })}\n\n`);
    return;
  }
  const pct = burnRate(b.spent, b.total);
  const event = pct >= 90 ? 'threshold' : 'ok';
  notify(id, event, { percentUsed: Number(pct.toFixed(2)), spent: b.spent, total: b.total });
});

module.exports = router;
