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

export default function EmployeeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const positions = [
    "Software Engineer",
    "Senior Software Engineer",
    "Product Manager",
    "Designer",
    "Data Scientist",
    "DevOps Engineer",
    "QA Engineer",
    "Project Manager"
  ];

  const departments = [
    "Engineering",
    "Product",
    "Design",
    "Data Science",
    "Operations",
    "Marketing",
    "Sales",
    "HR"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await apiPost("/api/employees", { name, email, position, department });
      setMessage("Employee added successfully!");
      setName("");
      setEmail("");
      setPosition("");
      setDepartment("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
      <Typography variant="h6" gutterBottom>
        Add New Employee
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />
          </Grid>
          <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            />
          </Grid>
          <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
            <TextField
              select
              label="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            >
              {positions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
            <TextField
              select
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              fullWidth
              margin="normal"
              required
              variant="outlined"
            >
              {departments.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
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
            {loading ? "Adding Employee..." : "Add Employee"}
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
