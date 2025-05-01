import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

const Result = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/analyze', {
          domain: state.domain
        });
        setReport(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [state.domain]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>Analyzing {state.domain}...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4">Report for {state.domain}</Typography>
        <pre style={{ marginTop: '2rem', background: '#f5f5f5', padding: '1rem' }}>
          {JSON.stringify(report, null, 2)}
        </pre>
      </Box>
    </Container>
  );
};

export default Result;

