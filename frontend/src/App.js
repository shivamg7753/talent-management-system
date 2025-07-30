import React, { useState } from 'react';
import { Container, Typography, Tabs, Tab, Box } from '@mui/material';
import AuthForm from './features/auth/AuthForm.js';
import EmployeeList from './features/employee/EmployeeList.js';
import EmployeeForm from './features/employee/EmployeeForm.js';
import BudgetList from './features/budget/BudgetList.js';
import BudgetForm from './features/budget/BudgetForm.js';
import BudgetForecast from './features/budget/BudgetForecast.js';
import ResumeUpload from './features/recruitment/ResumeUpload.js';
import CandidateTable from './features/recruitment/CandidateTable.js';

export default function App() {
  const [tab, setTab] = useState(0);
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Talent Management System</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Auth" />
        <Tab label="Employees" />
        <Tab label="Budgets" />
        <Tab label="Recruitment" />
      </Tabs>
      <Box hidden={tab !== 0}><AuthForm /></Box>
      <Box hidden={tab !== 1}><EmployeeForm /><EmployeeList /></Box>
      <Box hidden={tab !== 2}><BudgetForm /><BudgetList /><BudgetForecast /></Box>
      <Box hidden={tab !== 3}><ResumeUpload /><CandidateTable /></Box>
    </Container>
  );
}