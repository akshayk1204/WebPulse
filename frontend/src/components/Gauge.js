// src/components/Gauge.js
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Gauge = ({ value, size = 100, color = '#4caf50', icon = null }) => {
  const thickness = 5;

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-block',
      }}
    >
      {/* Background track */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        sx={{ color: '#e0e0e0', position: 'absolute', left: 0, top: 0 }}
        thickness={thickness}
      />
      {/* Actual score progress */}
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        sx={{ color, position: 'absolute', left: 0, top: 0 }}
        thickness={thickness}
      />
      {/* Center content */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon ? (
          <Box sx={{ fontSize: size * 0.4, lineHeight: 1 }}>{icon}</Box>
        ) : (
          <Typography
            variant="caption"
            component="div"
            color="textSecondary"
            fontWeight="bold"
          >
            {`${Math.round(value)}%`}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Gauge;
