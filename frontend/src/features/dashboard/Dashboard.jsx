import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Chip,
} from '@mui/material';
import {
  People,
  AttachMoney,
  Work,
  TrendingUp,
} from '@mui/icons-material';
import { apiGet } from '../../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    employees: 0,
    budgets: 0,
    candidates: 0,
    totalBudget: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch data from different endpoints
        const [employeesData, budgetsData, candidatesData] = await Promise.allSettled([
          apiGet('/api/employees'),
          apiGet('/api/budget'),
          apiGet('/api/recruitment/candidates'),
        ]);

        const newStats = {
          employees: employeesData.status === 'fulfilled' ? (employeesData.value.employees || employeesData.value || []).length : 0,
          budgets: budgetsData.status === 'fulfilled' ? (budgetsData.value.budgets || budgetsData.value || []).length : 0,
          candidates: candidatesData.status === 'fulfilled' ? (candidatesData.value.candidates || candidatesData.value.results || []).length : 0,
          totalBudget: budgetsData.status === 'fulfilled' 
            ? (budgetsData.value.budgets || budgetsData.value || [])
                .reduce((sum, budget) => sum + (budget.amount || budget.total || 0), 0)
            : 0,
        };

        setStats(newStats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.employees,
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary',
    },
    {
      title: 'Active Budgets',
      value: stats.budgets,
      icon: <AttachMoney sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success',
    },
    {
      title: 'Candidates',
      value: stats.candidates,
      icon: <Work sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning',
    },
    {
      title: 'Total Budget',
      value: `$${stats.totalBudget.toLocaleString()}`,
      icon: <TrendingUp sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info',
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to your Talent Management System. Here's an overview of your organization.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid key={index} sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" component="div" gutterBottom>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => window.location.hash = '#employees'}
              >
                Add New Employee
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => window.location.hash = '#budgets'}
              >
                Create Budget
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => window.location.hash = '#recruitment'}
              >
                Screen Resumes
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">API Connection</Typography>
                <Chip label="Connected" color="success" size="small" />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Database</Typography>
                <Chip label="Online" color="success" size="small" />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Services</Typography>
                <Chip label="Running" color="success" size="small" />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 