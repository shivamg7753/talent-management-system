import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import { apiGet } from '../../lib/api';

export default function CandidateTable() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet('/recruitment/candidates')
      .then(data => {
        setCandidates(data.candidates || data.results || []);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!candidates.length) return <Typography>No candidates found.</Typography>;

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Resume</TableCell>
            <TableCell>Job Description</TableCell>
            <TableCell>Match Score</TableCell>
            <TableCell>Skills</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {candidates.map((c, i) => (
            <TableRow key={c.id || c.email || i}>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.resume_file}</TableCell>
              <TableCell>{c.jd_file}</TableCell>
              <TableCell>{c.match_score}</TableCell>
              <TableCell>{c.extracted_skills?.join(', ')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}