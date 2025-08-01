import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Grid,
} from "@mui/material";
import { apiGet, apiPost } from "../../lib/api";
import SkillsGraph from "./SkillsGraph.tsx";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [skillsError, setSkillsError] = useState(null);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const handleOpen = (employee) => {
    setSelectedEmployee(employee);
    setSkillsInput("");
    setSkillsError(null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
    setSkillsInput("");
    setSkillsError(null);
  };
  const handleSkillsSubmit = async () => {
    setSkillsLoading(true);
    setSkillsError(null);
    try {
      const skillsArr = skillsInput
        .split(",")
        .map((s) => ({ name: s.trim() }))
        .filter((s) => s.name);
      await apiPost(`/api/employees/${selectedEmployee.id}/skills`, {
        skills: skillsArr,
      });
      handleClose();
    } catch (e) {
      setSkillsError(e.message);
    } finally {
      setSkillsLoading(false);
    }
  };

  useEffect(() => {
    apiGet("/api/employees")
      .then((data) => setEmployees(data.employees || data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!employees.length) return <Typography>No employees found.</Typography>;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((e) => (
                                  <TableRow key={e.id}>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.email}</TableCell>
                  <TableCell>{e.position}</TableCell>
                  <TableCell>{e.department || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpen(e)}
                    >
                      Edit Skills
                    </Button>
                  </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <SkillsGraph />
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Skills for {selectedEmployee?.name}</DialogTitle>
        <DialogContent>
          <TextField
            label="Skills (comma separated)"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            fullWidth
            margin="normal"
            autoFocus
          />
          {skillsError && <Typography color="error">{skillsError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={skillsLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSkillsSubmit}
            variant="contained"
            disabled={skillsLoading || !skillsInput}
          >
            {skillsLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
