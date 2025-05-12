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
  Grid,
  Divider,
  styled,
  useTheme
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import SpeedIcon from '@mui/icons-material/Speed';
import SearchIcon from '@mui/icons-material/Search';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import SecurityIcon from '@mui/icons-material/Security';
import axios from 'axios';
import ECLogo from '../assets/EC-logo.svg';

// Styled Components
const PageBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(160deg, #f8faff 0%, #f0f4ff 100%)',
  padding: theme.spacing(0),
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #00112F 0%, #0038A8 100%)',
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4, 2),
  margin: theme.spacing(0, 'auto', 4),
  textAlign: 'center',
  boxShadow: theme.shadows[10],
  position: 'relative',
  overflow: 'hidden',
  width: '90%',
  maxWidth: '1200px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2),
    width: '95%',
  }
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
  border: '1px solid rgba(0, 17, 47, 0.08)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 17, 47, 0.05)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0, 17, 47, 0.1)',
    background: 'linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%)',
  },
  '& svg': {
    fontSize: '2.5rem',
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #0038A8 0%, #0066FF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    padding: theme.spacing(1),
  },
  '& h6': {
    background: 'linear-gradient(135deg, #00112F 0%, #0038A8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  '& .MuiTypography-body2': {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  }
}));

const DomainInput = styled(TextField)(({ theme }) => ({
  maxWidth: '100%',
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
    },
  },
}));

const AnalyzeButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.25, 4),
  fontSize: '1rem',
  fontWeight: 700,
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  background: 'linear-gradient(135deg, #0038A8 0%, #0066FF 100%)',
  '&:hover': {
    background: 'linear-gradient(135deg, #00287A 0%, #0055DD 100%)',
    boxShadow: theme.shadows[6],
  },
  '&.Mui-disabled': {
    background: theme.palette.action.disabledBackground,
  }
}));

const EdgecastSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  textAlign: 'center',
  boxShadow: theme.shadows[2],
  margin: theme.spacing(0, 'auto'),
  width: '90%',
  maxWidth: '1200px',
}));

const FeatureGrid = styled(Grid)(({ theme }) => ({
  width: '95%',
  maxWidth: '1200px',
  margin: theme.spacing(0, 'auto', 3),
  paddingLeft: '5%', // Shifts cards slightly to the right
  [theme.breakpoints.down('sm')]: {
    paddingLeft: 0,
    width: '90%',
  }
}));

const Home = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

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
      
      console.log('Server Response:', response);

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
    <PageBackground>
      <Container maxWidth={false} sx={{ 
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
      }}>
        {/* Edgecast Logo */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 3,
          '& img': {
            height: '40px',
            width: 'auto',
            [theme.breakpoints.down('sm')]: {
              height: '32px',
            }
          }
        }}>
          <img src={ECLogo} alt="Edgecast Logo" />
        </Box>

        {/* Hero Section */}
        <HeroSection>
          <Typography variant="h3" component="h1" gutterBottom sx={{ 
            fontWeight: 700,
            [theme.breakpoints.down('sm')]: {
              fontSize: '2rem',
            }
          }}>
            🔍 WebPulse
          </Typography>
          <Typography variant="h6" component="h2" sx={{ 
            mb: 3,
            opacity: 0.9,
            [theme.breakpoints.down('sm')]: {
              fontSize: '1rem',
            }
          }}>
            Comprehensive Website Analysis Platform
          </Typography>
          
          {!backendOnline && (
            <Alert severity="error" sx={{ 
              mb: 2, 
              maxWidth: 600, 
              mx: 'auto',
              textAlign: 'left'
            }}>
              Backend server is unavailable. Please ensure the backend is running.
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={8}>
                <DomainInput
                  fullWidth
                  variant="outlined"
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  disabled={!backendOnline}
                  sx={{
                    '& .MuiOutlinedInput-input': {
                      padding: '12.5px 14px',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <AnalyzeButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading || !backendOnline}
                >
                  {loading ? 'Analyzing...' : 'Run Analysis'}
                </AnalyzeButton>
              </Grid>
            </Grid>
          </Box>

          {loading && (
            <Box sx={{ py: 4 }}>
              <PulsingLoader />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ 
              mt: 2, 
              maxWidth: 600, 
              mx: 'auto',
              textAlign: 'left'
            }}>
              {error}
            </Alert>
          )}

          <Typography variant="caption" sx={{ 
            mt: 2, 
            display: 'block',
            opacity: 0.8
          }}>
            Note: Analysis may take 30-45 seconds for comprehensive results
          </Typography>
        </HeroSection>

        {/* Feature Cards - Centered under blue box */}
        <FeatureGrid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard elevation={3}>
              <SpeedIcon />
              <Typography variant="subtitle1" gutterBottom>
                Performance
              </Typography>
              <Typography variant="body2">
                Page speed, resource optimization, and core web vitals analysis
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard elevation={3}>
              <SearchIcon />
              <Typography variant="subtitle1" gutterBottom>
                SEO
              </Typography>
              <Typography variant="body2">
                Metadata, structure, content and search visibility assessment
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard elevation={3}>
              <MobileFriendlyIcon />
              <Typography variant="subtitle1" gutterBottom>
                Mobile
              </Typography>
              <Typography variant="body2">
                Responsiveness, usability, and mobile-first indexing evaluation
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard elevation={3}>
              <SecurityIcon />
              <Typography variant="subtitle1" gutterBottom>
                Security
              </Typography>
              <Typography variant="body2">
                Vulnerabilities, HTTPS implementation, and headers inspection
              </Typography>
            </FeatureCard>
          </Grid>
        </FeatureGrid>

        {/* Edgecast Section */}
        <EdgecastSection>
          <Typography variant="h6" component="h2" gutterBottom sx={{ 
            fontWeight: 700,
            color: theme.palette.getContrastText(theme.palette.primary.light)
          }}>
            Powered by Edgecast Technology
          </Typography>
          <Typography variant="body2" sx={{ 
            mb: 2,
            color: theme.palette.getContrastText(theme.palette.primary.light)
          }}>
            Leveraging Edgecast's global infrastructure and security expertise for accurate analysis
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
            sx={{ 
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: theme.shadows[2],
            }}
            onClick={() => window.open('https://www.edgecast.io', '_blank')}
          >
            Learn More
          </Button>
        </EdgecastSection>
      </Container>
    </PageBackground>
  );
};

export default Home;