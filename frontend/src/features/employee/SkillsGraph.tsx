import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import { apiGet } from '../../lib/api';

interface Skill {
  name: string;
  count: number;
}

interface SkillsGraphProps {
  employeeId?: string;
}

export default function SkillsGraph({ employeeId }: SkillsGraphProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const endpoint = employeeId 
          ? `/employees/${employeeId}/skills` 
          : '/employees/skills';
        const { data } = await apiGet(endpoint);
        setSkills(data.skills || data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [employeeId]);

  if (loading) {
    return (
      <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (!skills.length) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>No skills data available.</Typography>
      </Paper>
    );
  }

  const maxCount = Math.max(...skills.map(s => s.count));

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {employeeId ? 'Employee Skills' : 'Skills Distribution'}
      </Typography>
      <Box sx={{ mt: 2 }}>
        {skills.map((skill, index) => (
          <Box key={skill.name} sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">{skill.name}</Typography>
              <Typography variant="body2">{skill.count}</Typography>
            </Box>
            <Box
              sx={{
                width: '100%',
                height: 20,
                backgroundColor: '#e0e0e0',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${(skill.count / maxCount) * 100}%`,
                  height: '100%',
                  backgroundColor: `hsl(${(index * 30) % 360}, 70%, 60%)`,
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
