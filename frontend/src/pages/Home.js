import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PulsingLoader from '../components/PulsingLoader';

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  InputAdornment,
  Alert,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import axios from 'axios';

const Home = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const navigate = useNavigate();

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/`, { timeout: 3000 });
        setBackendOnline(true);
      } catch (err) {
        setBackendOnline(false);
        console.error('Backend connection error:', err);
      }
    };
    checkBackend();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!domain) return;

    // Basic domain validation
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain)) {
      setError('Please enter a valid domain (e.g. example.com)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/analyze`, 
        { domain },
        { 
          timeout: 45000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data?.performance) {
        throw new Error('Invalid response structure from server');
      }

      navigate('/result', {
        state: {
          domain,
          performance: response.data.performance || {},
          seo: response.data.seo || {},
          security: response.data.security || {},
          mobile: response.data.mobile || { responsive: false }
        }
      });
    } catch (err) {
      console.error('Analysis error:', err);
      let errorMessage = 'Analysis failed. Please try again.';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'The request took too long. Please try again later.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 12, p: 5, borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          🔍 WebPulse
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          Analyze your website for Performance, SEO, Mobile, and Security.
        </Typography>

        {!backendOnline && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Backend server is unavailable. Please ensure the backend is running.
          </Alert>
        )}

        {!loading && (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Enter your domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LanguageIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              disabled={!backendOnline}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 1, py: 1.5 }}
              disabled={loading || !backendOnline}
            >
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </Button>
          </Box>
        )}

        {loading && <PulsingLoader />}

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
          Note: Analysis may take 30-45 seconds for comprehensive results
        </Typography>
      </Paper>
    </Container>
  );
};

export default Home;
