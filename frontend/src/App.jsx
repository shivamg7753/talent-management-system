import React, { useState } from "react";
import { 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  AppBar, 
  Toolbar, 
  CssBaseline,
  ThemeProvider,
  createTheme,
  Paper
} from "@mui/material";
import AuthForm from "./features/auth/AuthForm.jsx";
import Dashboard from "./features/dashboard/Dashboard.jsx";
import EmployeeList from "./features/employee/EmployeeList.jsx";
import EmployeeForm from "./features/employee/EmployeeForm.jsx";
import BudgetList from "./features/budget/BudgetList.jsx";
import BudgetForm from "./features/budget/BudgetForm.jsx";
import BudgetForecast from "./features/budget/BudgetForecast.jsx";
import ResumeUpload from "./features/recruitment/ResumeUpload.jsx";
import CandidateTable from "./features/recruitment/CandidateTable.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function App() {
  const [tab, setTab] = useState(0);
  
  const tabLabels = [
    { label: "Dashboard", icon: "📊" },
    { label: "Authentication", icon: "🔐" },
    { label: "Employees", icon: "👥" },
    { label: "Budgets", icon: "💰" },
    { label: "Recruitment", icon: "📋" }
  ];

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              🚀 Talent Management System
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Tabs 
              value={tab} 
              onChange={(_, v) => setTab(v)} 
              sx={{ mb: 2 }}
              variant="scrollable"
              scrollButtons="auto"
            >
              {tabLabels.map((tabInfo, index) => (
                <Tab 
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{tabInfo.icon}</span>
                      <span>{tabInfo.label}</span>
                    </Box>
                  } 
                />
              ))}
            </Tabs>
          </Paper>

          <Box hidden={tab !== 0}>
            <Dashboard />
          </Box>
          <Box hidden={tab !== 1}>
            <AuthForm />
          </Box>
          <Box hidden={tab !== 2}>
            <EmployeeForm />
            <EmployeeList />
          </Box>
          <Box hidden={tab !== 3}>
            <BudgetForm />
            <BudgetList />
            <BudgetForecast />
          </Box>
          <Box hidden={tab !== 4}>
            <ResumeUpload />
            <CandidateTable />
          </Box>
        </Container>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
