import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Container, Alert,
  LinearProgress, Button, Divider
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Speed as SpeedIcon,
  Search as SearchIcon,
  Devices as DevicesIcon,
  Shield as ShieldIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import SpeedoSVG from '../assets/speedo.svg';
import SeoSVG from '../assets/seo.svg';
import MobileSVG from '../assets/mobile.svg';
import SecuritySVG from '../assets/security.svg';
import { calculateSeoScore, calculateMobileScore, calculateSecurityScore, getScoreColor } from '../utils/scoreUtils';
import generatePdf from '../utils/generatePdf';

// Import all required sections
import PerformanceSection from '../sections/PerformanceSection';
import SEOSection from '../sections/SEOSection';
import MobileSection from '../sections/MobileSection';
import SecuritySection from '../sections/securitySection';

const translations = {
  en: {
    overallScore: "Overall Score",
    performance: "Performance",
    seo: "SEO",
    mobile: "Mobile",
    security: "Security",
    webPulse: "WebPulse Report",
    performanceAssessment: (score) => {
      if (score >= 80) return "This site is Good";
      if (score >= 50) return "This site is OK";
      return "This site needs work";
    },
    performanceMotivation: "Now let's take your site from good to great. See your scorecard below and take action today!",
    noDataFound: "No analysis data found",
    backToHome: "Back to Home"
  },
  es: {
    overallScore: "Puntuación General",
    performance: "Rendimiento",
    seo: "SEO",
    mobile: "Móvil",
    security: "Seguridad",
    webPulse: "Informe WebPulse",
    performanceAssessment: (score) => {
      if (score >= 80) return "Este sitio es bueno";
      if (score >= 50) return "Este sitio está bien";
      return "Este sitio necesita mejoras";
    },
    performanceMotivation: "Llevemos su sitio de bueno a excelente. Vea su informe a continuación y actúe hoy.",
    noDataFound: "No se encontraron datos de análisis",
    backToHome: "Volver al Inicio"
  }
};

const SidePanel = styled(Box)(({ theme }) => ({
  backgroundColor: '#00112F',
  color: theme.palette.common.white,
  width: '25%',
  minHeight: '100vh',
  padding: theme.spacing(4, 0),
  position: 'fixed',
  left: 0,
  top: 0,
  [theme.breakpoints.down('md')]: {
    position: 'relative',
    width: '100%',
    minHeight: 'auto'
  }
}));

const MainContent = styled(Box)(({ theme }) => ({
  marginLeft: '25%',
  width: '75%',
  padding: theme.spacing(4),
  backgroundColor: '#E0E7F7',
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    width: '100%',
    padding: theme.spacing(2)
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(4),
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    marginBottom: theme.spacing(2)
  }
}));

const ReportView = () => {
  const { guid } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/report/${guid}`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format');
        }
        
        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchReport();
  }, [guid]);

  const handleDownloadPdf = async () => {
    if (!report) return;
    
    setIsGeneratingPdf(true);
    try {
      await generatePdf(
        report.domain,
        {
          overall: report.scores.overall,
          performance: report.scores.performance,
          seo: report.scores.seo,
          mobile: report.scores.mobile,
          security: report.scores.security
        },
        {
          performance: report.performance_data,
          seo: report.seo_data,
          mobile: report.mobile_data,
          security: report.security_data
        },
        report.language || 'en'
      );
    } catch (error) {
      console.error('PDF generation error:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !report) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || translations.en.noDataFound}</Alert>
      </Container>
    );
  }

  const {
    domain,
    scores = {},
    performance_data = {},
    seo_data = {},
    mobile_data = {},
    security_data = {},
    language = 'en'
  } = report;

  const t = translations[language] || translations.en;
  const performanceScore = scores.performance || 0;
  const seoScore = scores.seo || calculateSeoScore(seo_data);
  const mobileScore = scores.mobile || calculateMobileScore(mobile_data);
  const securityScore = scores.security || calculateSecurityScore(security_data);
  const overallScore = scores.overall || 
    Math.round((performanceScore + seoScore + mobileScore + securityScore) / 4);

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh' }}>
      <SidePanel>
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>
            {domain}
          </Typography>
          
          <Box sx={{ position: 'relative', width: 180, height: 180, mx: 'auto', mb: 4 }}>
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
              { label: t.performance, score: performanceScore, icon: <SpeedIcon /> },
              { label: t.seo, score: seoScore, icon: <SearchIcon /> },
              { label: t.mobile, score: mobileScore, icon: <DevicesIcon /> },
              { label: t.security, score: securityScore, icon: <ShieldIcon /> }
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
            
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 'bold',
                  backgroundColor: '#FF6F59',
                  '&:hover': {
                    backgroundColor: '#E65A46'
                  }
                }}
              >
                {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
              </Button>
            </Box>
          </Box>
        </Box>
      </SidePanel>

      <MainContent>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={4} mb={4}>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {t.webPulse}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mt: 3 }}>
            {t.performanceAssessment(performanceScore)}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mt: 1, maxWidth: 700 }}>
            {t.performanceMotivation}
          </Typography>

          {performance_data?.screenshot && (
            <Box sx={{ 
              mt: 4, 
              mb: 6,
              width: '100%',
              maxWidth: '800px',
              border: '1px solid #ddd',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
              mx: 'auto'
            }}>
              <Box
                component="img"
                src={performance_data.screenshot}
                alt={`${domain} screenshot`}
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </Box>
          )}
        </Box>

        <SectionHeader>
          <img src={SpeedoSVG} alt="Speedometer Icon" style={{ width: 80 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t.performance}
          </Typography>
        </SectionHeader>
        <PerformanceSection data={{ ...performance_data, score: performanceScore }} language={language} />
        <Divider sx={{ my: 4 }} />

        <SectionHeader>
          <img src={SeoSVG} alt="SEO Icon" style={{ width: 80 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t.seo}
          </Typography>
        </SectionHeader>
        <SEOSection data={{ ...seo_data, score: seoScore }} language={language} />
        <Divider sx={{ my: 4 }} />

        <SectionHeader>
          <img src={MobileSVG} alt="Mobile Icon" style={{ width: 80 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t.mobile}
          </Typography>
        </SectionHeader>
        <MobileSection data={{ ...mobile_data, score: mobileScore }} language={language} />
        <Divider sx={{ my: 4 }} />

        <SectionHeader>
          <img src={SecuritySVG} alt="Security Icon" style={{ width: 80 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t.security}
          </Typography>
        </SectionHeader>
        <SecuritySection data={{ ...security_data, score: securityScore }} language={language} />
      </MainContent>
    </Box>
  );
};

export default ReportView;