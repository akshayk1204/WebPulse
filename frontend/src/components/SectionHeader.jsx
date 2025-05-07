import React from 'react';
import { Typography, Box } from '@mui/material';

const SectionHeader = ({ title, tagline }) => (
  <Box textAlign="center" mb={4}>
    <Typography variant="h4" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="textSecondary">
      {tagline}
    </Typography>
  </Box>
);

export default SectionHeader;