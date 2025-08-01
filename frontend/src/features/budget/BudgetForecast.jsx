import React, { useState } from "react";
import { Button, TextField, Paper, Alert, Typography, Box } from "@mui/material";
import { apiGet } from "../../lib/api";
import ForecastChart from "./ForecastChart.tsx";

export default function BudgetForecast() {
  const [budgetId, setBudgetId] = useState("");
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setForecast(null);
    try {
      const data = await apiGet(`/api/budget/forecast/${budgetId}`);
      setForecast(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <TextField
        label="Budget ID"
        value={budgetId}
        onChange={(e) => setBudgetId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={handleFetch}
        disabled={loading || !budgetId}
        sx={{ mt: 2 }}
      >
        {loading ? "Fetching..." : "Get Forecast"}
      </Button>
      {forecast && (
        <Box sx={{ mt: 2 }}>
          {Array.isArray(forecast) && forecast.length > 0 ? (
            <ForecastChart data={forecast} title="Budget Forecast" />
          ) : (
            <Typography>
              Forecast: {JSON.stringify(forecast)}
            </Typography>
          )}
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
}
