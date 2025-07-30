import React, { useState } from 'react';
import { Button, TextField, Paper, Alert, Typography } from '@mui/material';
import { apiGet } from '../../lib/api';

export default function BudgetForecast() {
  const [budgetId, setBudgetId] = useState('');
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setForecast(null);
    try {
      const data = await apiGet(`/budget/forecast/${budgetId}`);
      setForecast(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <TextField label="Budget ID" value={budgetId} onChange={e => setBudgetId(e.target.value)} fullWidth margin="normal" />
      <Button variant="contained" onClick={handleFetch} disabled={loading || !budgetId} sx={{ mt: 2 }}>
        {loading ? 'Fetching...' : 'Get Forecast'}
      </Button>
      {forecast && <Typography sx={{ mt: 2 }}>Forecast: {JSON.stringify(forecast)}</Typography>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Paper>
  );
}