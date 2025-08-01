import React, { useState } from "react";
import { 
  Button, 
  TextField, 
  Paper, 
  Alert, 
  Typography, 
  Box,
  Grid,
  MenuItem
} from "@mui/material";
import { apiPost } from "../../lib/api";

export default function BudgetForm() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    "Salary & Benefits",
    "Training & Development",
    "Recruitment",
    "Technology & Tools",
    "Office & Facilities",
    "Marketing & Events",
    "Travel & Expenses",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await apiPost("/api/budget", { 
        name, 
        total: parseFloat(amount),
        category,
        description 
      });
      setMessage("Budget added successfully!");
      setName("");
      setAmount("");
      setCategory("");
      setDescription("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
      <Typography variant="h6" gutterBottom>
        Add New Budget
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Budget Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              margin="normal"
              required
              type="number"
              variant="outlined"
              InputProps={{
                startAdornment: <span>$</span>,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            size="large"
          >
            {loading ? "Adding Budget..." : "Add Budget"}
          </Button>
        </Box>
        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </form>
    </Paper>
  );
}
