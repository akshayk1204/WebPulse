import React from 'react';
import { Typography, Box } from '@mui/material';

const MetricItem = ({ label, value }) => (
  <Box sx={{ mb: 1 }}>
    <Typography variant="body2"><strong>{label}:</strong> {value}</Typography>
  </Box>
);

export default MetricItem;