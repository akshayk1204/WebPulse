import React from 'react';
import { Paper, Typography, Box, LinearProgress, Divider, Grid } from '@mui/material';
import MetricItem from './MetricItem';

const getColor = (score) => {
  if (score >= 80) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
};

const ScoreCard = ({ title, score, metrics }) => (
  <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mb: 5 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="subtitle2" color={getColor(score)}>
        {score}/100
      </Typography>
    </Box>

    <LinearProgress
      variant="determinate"
      value={score}
      color={getColor(score)}
      sx={{ height: 12, borderRadius: 6, mb: 3 }}
    />

    <Divider sx={{ mb: 3 }} />

    <Grid container spacing={2}>
      {metrics.map((metric, idx) => (
        <Grid item xs={12} sm={6} key={idx}>
          <MetricItem label={metric.label} value={metric.value} />
        </Grid>
      ))}
    </Grid>
  </Paper>
);

export default ScoreCard;
