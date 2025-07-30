// src/routes/budgets.js
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { notify } = require('../monitoring/alerts');
const { burnRate } = require('../monitoring/burn-rate');

// POST /budgets  (create)
router.post('/budgets', async (req, res) => {
  try {
    const { name, total } = req.body || {};
    if (!name || !total || Number(total) <= 0) {
      return res.status(400).json({ error: 'name and total (>0) are required' });
    }
    const budget = await Budget.create({ name, total, spent: 0 });
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /budgets/:id  (fetch one)
router.get('/budgets/:id', async (req, res) => {
  const b = await Budget.findByPk(req.params.id);
  if (!b) return res.status(404).json({ error: 'Budget not found' });
  res.json(b);
});

// POST /budgets/:id/spend  (increment spend + alert if >=90%)
router.post('/budgets/:id/spend', async (req, res) => {
  try {
    const { amount } = req.body || {};
    if (amount === undefined || isNaN(Number(amount))) {
      return res.status(400).json({ error: 'amount (number) is required' });
    }
    const b = await Budget.findByPk(req.params.id);
    if (!b) return res.status(404).json({ error: 'Budget not found' });

    b.spent = Number(b.spent) + Number(amount);
    await b.save();

    const pct = burnRate(b.spent, b.total);
    if (pct >= 90) {
      notify(b.id, 'threshold', {
        message: 'Spending exceeded 90%',
        percentUsed: Number(pct.toFixed(2)),
        spent: b.spent,
        total: b.total,
      });
    } else {
      notify(b.id, 'ok', {
        message: 'Spending within limits',
        percentUsed: Number(pct.toFixed(2)),
        spent: b.spent,
        total: b.total,
      });
    }

    res.json({ id: b.id, name: b.name, total: b.total, spent: b.spent, percentUsed: Number(pct.toFixed(2)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
