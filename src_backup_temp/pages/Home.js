import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const Home = () => {
  const [domain, setDomain] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!domain) return;
    navigate('/result', { state: { domain } });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>WebPulse</Typography>
        <Typography variant="subtitle1" gutterBottom>
          Enter your domain to analyze website performance, SEO, and security
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <TextField
            fullWidth
            label="Website Domain"
            variant="outlined"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Analyze
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;

