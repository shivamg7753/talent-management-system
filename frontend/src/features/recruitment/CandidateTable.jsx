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
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Refresh, Visibility } from "@mui/icons-material";
import { apiGet } from "../../lib/api";

export default function CandidateTable() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCandidates = () => {
    setLoading(true);
    setError(null);
    apiGet("/api/recruitment/candidates")
      .then((data) => {
        setCandidates(data.candidates || data.results || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  if (loading)
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading candidates...</Typography>
      </Paper>
    );
  if (error)
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={fetchCandidates}>
          Retry
        </Button>
      </Paper>
    );
  if (!candidates.length)
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No candidates found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Start by uploading some resumes to see candidates here.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchCandidates}
        >
          Refresh
        </Button>
      </Paper>
    );

  return (
    <Paper sx={{ p: 3 }} elevation={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Candidates ({candidates.length})
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchCandidates} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Candidate</TableCell>
              <TableCell>Resume</TableCell>
              <TableCell>Job Description</TableCell>
              <TableCell>Match Score</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((c, i) => (
              <TableRow key={c.id || c.email || i} hover>
                <TableCell>
                  <Typography variant="subtitle2">
                    {c.email || "Unknown"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {c.resume_file || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {c.jd_file || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  {c.match_score != null ? (
                    <Chip
                      label={`${c.match_score}%`}
                      color={c.match_score > 80 ? 'success' : c.match_score > 60 ? 'warning' : 'error'}
                      size="small"
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {Array.isArray(c.extracted_skills) && c.extracted_skills.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {c.extracted_skills.slice(0, 3).map((skill, index) => (
                        <Chip key={index} label={skill} size="small" variant="outlined" />
                      ))}
                      {c.extracted_skills.length > 3 && (
                        <Chip label={`+${c.extracted_skills.length - 3}`} size="small" />
                      )}
                    </Box>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
