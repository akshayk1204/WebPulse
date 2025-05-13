import React from 'react';
import { styled } from '@mui/system';
import { Box, Typography, LinearProgress, Button } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import SearchIcon from '@mui/icons-material/Search';
import DevicesIcon from '@mui/icons-material/Devices';
import ShieldIcon from '@mui/icons-material/Shield';
import Gauge from './Gauge';
import ECLogo from '../assets/EC-logo.svg';

const SidePanelContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#00112F',
  color: theme.palette.common.white,
  width: '25%',
  minHeight: '100vh',
  padding: theme.spacing(5, 0),
  boxShadow: theme.shadows[10],
  position: 'fixed',
  left: 0,
  top: 0,
  [theme.breakpoints.down('lg')]: {
    width: '30%'
  },
  [theme.breakpoints.down('md')]: {
    position: 'relative',
    width: '100%',
    minHeight: 'auto'
  }
}));

const SidePanel = ({ 
  domain, 
  overallScore, 
  performanceScore, 
  seoScore, 
  mobileScore, 
  securityScore,
  hideShareButton,
  guid,
  translations,
  language
}) => {
  const t = translations[language] || translations.en;
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC107';
    return '#F44336';
  };

  return (
    <SidePanelContainer>
      {/* Your SidePanel content here - copied from Result.js */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        p: 3,
        pb: 1,
        mb: 2,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <img 
          src={ECLogo} 
          alt="Edgecast Logo" 
          style={{ 
            height: '32px', 
            width: 'auto',
            filter: 'brightness(0) invert(1)'
          }} 
        />
      </Box>
      
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
          {domain}
        </Typography>
        
        <Box sx={{ position: 'relative', width: 180, height: 180, mx: 'auto', mb: 4 }}>
          <Gauge value={overallScore} size={180} />
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
              {overallScore}
            </Typography>
            <Typography variant="caption" sx={{ color: '#ccc' }}>
              {t.overallScore}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'left', px: 2 }}>
          {[
            { label: t.performance, score: performanceScore, icon: <SpeedIcon />, section: 'performance' },
            { label: t.seo, score: seoScore, icon: <SearchIcon />, section: 'seo' },
            { label: t.mobile, score: mobileScore, icon: <DevicesIcon />, section: 'mobile' },
            { label: t.security, score: securityScore, icon: <ShieldIcon />, section: 'security' }
          ].map((item, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 1, color: getScoreColor(item.score) }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" sx={{ color: '#fff' }}>{item.label}</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#fff' }}>{item.score}/100</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={item.score} 
                sx={{
                  height: 8,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { backgroundColor: getScoreColor(item.score) }
                }} 
              />
            </Box>
          ))}
          
          {!hideShareButton && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mt: 4,
              mb: 2
            }}>
              <Button 
                variant="contained"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  width: '90%',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  backgroundColor: '#FF6F59',
                  color: '#FFFFFF',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: '#E65A46'
                  },
                  '&:disabled': {
                    backgroundColor: '#FF6F59',
                    opacity: 0.7
                  }
                }}
                disabled={!guid}
                onClick={() => {
                  if (!guid) {
                    console.error('No GUID available for sharing');
                    return;
                  }
                  
                  const reportUrl = `https://webpulse.letsdemo.co/share/${guid}`;
                  console.log('Sharing report URL:', reportUrl);
                  
                  // Open in new tab
                  const newWindow = window.open(reportUrl, '_blank', 'noopener,noreferrer');
                  
                  // Fallback if popup is blocked
                  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    navigator.clipboard.writeText(reportUrl).then(() => {
                      alert('Report link copied to clipboard!');
                    }).catch(() => {
                      prompt('Copy this report link:', reportUrl);
                    });
                  }
                }}
              >
                Share Report
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </SidePanelContainer>
  );
};

export default SidePanel;