import React, { useState } from 'react';
import { Button, Typography, CircularProgress, List, ListItem, Paper } from '@mui/material';
import { apiGet } from '../../lib/api';

export default function ResumeUpload() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBatchScreen = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet('/recruitment/batch-screen');
      setResults(data.results || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Button variant="contained" onClick={handleBatchScreen} disabled={loading}>
        {loading ? 'Processing...' : 'Batch Screen Resumes'}
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {results.length > 0 && (
        <List>
          {results.map((r, i) => (
            <ListItem key={i}>
              {r.email} ({r.resume_file})  {r.jd_file} | Score: {r.match_score} | Skills: {r.extracted_skills?.join(', ')}
            </ListItem>
          ))}
        </List>
      )}
      {loading && <CircularProgress sx={{ ml: 2 }} />}
    </Paper>
  );
}