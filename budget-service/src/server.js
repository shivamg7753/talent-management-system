const express = require('express');
const sequelize = require('./sequelize');
const forecastRoutes = require('./routes/forecast');
const monitorRoutes = require('./routes/monitor'); // SSE only
const budgetsRoutes = require('./routes/budgets'); // create/get/spend

const app = express();
app.use(express.json());

// Health check
app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));

// Routes
app.use(forecastRoutes);
app.use(monitorRoutes);
app.use(budgetsRoutes);

const PORT = process.env.PORT || 8082;


(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');

    
    await sequelize.sync({ alter: true });
    console.log('✅ DB synced');

    app.listen(PORT, () =>
      console.log(`Budget Service listening on :${PORT}`)
    );
  } catch (e) {
    console.error('❌ DB init failed:', e);
    process.exit(1);
  }
})();
