import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface ForecastData {
  month: string;
  actual: number;
  forecast: number;
}

interface ForecastChartProps {
  data: ForecastData[];
  title?: string;
}

export default function ForecastChart({ data, title = 'Budget Forecast' }: ForecastChartProps) {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>No forecast data available.</Typography>
      </Paper>
    );
  }

  const maxValue = Math.max(
    ...data.flatMap(d => [d.actual, d.forecast])
  );

  const minValue = Math.min(
    ...data.flatMap(d => [d.actual, d.forecast])
  );

  const range = maxValue - minValue;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ mt: 2, height: 300, position: 'relative' }}>
        {/* Y-axis labels */}
        <Box sx={{ 
          position: 'absolute', 
          left: 0, 
          top: 0, 
          bottom: 0, 
          width: 60,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'text.secondary'
        }}>
          {[maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, minValue].map((value, index) => (
            <Box key={index} sx={{ textAlign: 'right', pr: 1 }}>
              ${value.toLocaleString()}
            </Box>
          ))}
        </Box>

        {/* Chart area */}
        <Box sx={{ 
          ml: 7, 
          height: '100%', 
          position: 'relative',
          borderLeft: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0'
        }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${ratio * 100}%`,
                height: '1px',
                backgroundColor: '#f0f0f0',
                zIndex: 1
              }}
            />
          ))}

          {/* Data points and lines */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const actualY = ((maxValue - point.actual) / range) * 100;
            const forecastY = ((maxValue - point.forecast) / range) * 100;

            return (
              <React.Fragment key={index}>
                {/* Actual data point */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${actualY}%`,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#1976d2',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3
                  }}
                />
                
                {/* Forecast data point */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${forecastY}%`,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#ff9800',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3
                  }}
                />

                {/* Connect lines */}
                {index > 0 && (
                  <>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: `${((index - 1) / (data.length - 1)) * 100}%`,
                        top: `${((maxValue - data[index - 1].actual) / range) * 100}%`,
                        width: `${100 / (data.length - 1)}%`,
                        height: '2px',
                        backgroundColor: '#1976d2',
                        transform: 'translateY(-50%)',
                        zIndex: 2
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        left: `${((index - 1) / (data.length - 1)) * 100}%`,
                        top: `${((maxValue - data[index - 1].forecast) / range) * 100}%`,
                        width: `${100 / (data.length - 1)}%`,
                        height: '2px',
                        backgroundColor: '#ff9800',
                        transform: 'translateY(-50%)',
                        zIndex: 2
                      }}
                    />
                  </>
                )}

                {/* X-axis labels */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: '100%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    mt: 1
                  }}
                >
                  {point.month}
                </Box>
              </React.Fragment>
            );
          })}
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#1976d2', borderRadius: '50%' }} />
          <Typography variant="body2">Actual</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#ff9800', borderRadius: '50%' }} />
          <Typography variant="body2">Forecast</Typography>
        </Box>
      </Box>
    </Paper>
  );
}
