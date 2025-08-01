import React, { useState } from "react";
import {
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  Paper,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { apiGet } from "../../lib/api";

export default function ResumeUpload() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBatchScreen = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet("/api/recruitment/batch-screen");
      setResults(data.results || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
      <Typography variant="h6" gutterBottom>
        Resume Screening
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Process and analyze resumes against job descriptions
      </Typography>
      
      <Button
        variant="contained"
        onClick={handleBatchScreen}
        disabled={loading}
        size="large"
        sx={{ mb: 3 }}
      >
        {loading ? "Processing Resumes..." : "Start Batch Screening"}
      </Button>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {loading && (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={20} />
          <Typography>Processing resumes...</Typography>
        </Box>
      )}
      
      {results.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Screening Results ({results.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {results.map((r, i) => (
              <Card key={i} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {r.email || 'Unknown Candidate'}
                    </Typography>
                    <Chip 
                      label={`${r.match_score || 0}% Match`}
                      color={r.match_score > 80 ? 'success' : r.match_score > 60 ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Resume: {r.resume_file || 'N/A'} | JD: {r.jd_file || 'N/A'}
                  </Typography>
                  {r.extracted_skills && r.extracted_skills.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {r.extracted_skills.map((skill, index) => (
                          <Chip key={index} label={skill} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
