import React, { useState, Suspense, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, LinearProgress, Alert,
  CircularProgress, Grid, Card, CardContent, List, ListItem, 
  ListItemIcon, Divider, IconButton, Tooltip
} from '@mui/material';
import { styled } from '@mui/system';
import ECLogo from '../assets/EC-logo.svg';
import { Translate } from '@mui/icons-material';
import Gauge from '../components/Gauge';
import { calculateSeoScore, getScoreColor, calculateMobileScore, calculateSecurityScore } from '../utils/scoreUtils';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import ShieldIcon from '@mui/icons-material/Shield';
import DevicesIcon from '@mui/icons-material/Devices';
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import SecuritySection from '../sections/securitySection';
import generatePdf from '../utils/generatePdf';
import DownloadIcon from '@mui/icons-material/Download';
import RecommendationSection from '../sections/RecommendationSection';
import SpeedoSVG from '../assets/speedo.svg';
import SeoSVG from '../assets/seo.svg';
import MobileSVG from '../assets/mobile.svg';
import SecuritySVG from '../assets/security.svg';

const PerformanceSection = React.lazy(() => import('../sections/PerformanceSection'));
const SEOSection = React.lazy(() => import('../sections/SEOSection'));
const MobileSection = React.lazy(() => import('../sections/MobileSection'));

// Translation dictionaries
const translations = {
  en: {
    overallScore: "Overall Score",
    performance: "Performance",
    mobileTitle: "Mobile Optimization",
    seo: "SEO",
    mobile: "Mobile",
    security: "Security",
    webPulse: "WebPulse",
    poweredBy: "powered by Edgecast",
    performanceAssessment: (score) => {
      if (score >= 80) return "This site is Good";
      if (score >= 50) return "This site is OK";
      return "This site needs work";
    },
    performanceMotivation: "Now let’s take your site from good to great. See your scorecard below and take action today!",    
    howEdgecastCanHelp: "How Edgecast Can Help",
    optimizeWith: (domain) => `Optimize ${domain} with Edgecast's Performance and Security Solutions`,
    edgecastProvides: "Edgecast provides industry-leading solutions to address the challenges identified in your website analysis.",
    performanceSolutions: "Performance Solutions",
    securitySolutions: "Security Solutions",
    mobileOptimization: "Mobile Optimization",
    globalInfrastructure: "Global Infrastructure",
    readyToImplement: "Ready to implement these improvements?",
    ourTeamCanHelp: "Our team can help you address all the recommendations in this report with customized solutions.",
    contactOurExperts: "Contact Our Experts",
    exploreSolutions: "Explore Edgecast Solutions",
    securityDescription: "Trust is your hardest currency—airtight security turns visitors into confident customers.",
    noDataFound: "No analysis data found. Please analyze a website first.",
    backToHome: "Back to Home",
    seoTagline: "Boost discoverability—optimize how your site is found and displayed in search results.",
    recommendations: {
      performance: "Performance Recommendations",
      seo: "SEO Recommendations",
      mobile: "Mobile Recommendations",
      security: "Security Recommendations"
    }
  },
  es: {
    overallScore: "Puntuación General",
    performance: "Rendimiento",
    mobileTitle: "Optimización Móvil",
    seo: "SEO",
    mobile: "Móvil",
    security: "Seguridad",
    webPulse: "WebPulse",
    poweredBy: "con tecnología de Edgecast",
    performanceAssessment: (score) => {
      if (score >= 80) return "Este sitio es bueno";
      if (score >= 50) return "Este sitio está bien";
      return "Este sitio necesita mejoras";
    },
    performanceMotivation: "Llevemos su sitio de bueno a excelente. Vea su informe a continuación y actúe hoy.",    
    howEdgecastCanHelp: "Cómo Edgecast Puede Ayudar",
    optimizeWith: (domain) => `Optimice ${domain} con las soluciones de rendimiento y seguridad de Edgecast`,
    edgecastProvides: "Edgecast proporciona soluciones líderes en la industria para abordar los desafíos identificados en su análisis de sitio web.",
    performanceSolutions: "Soluciones de Rendimiento",
    securitySolutions: "Soluciones de Seguridad",
    mobileOptimization: "Optimización Móvil",
    globalInfrastructure: "Infraestructura Global",
    readyToImplement: "¿Listo para implementar estas mejoras?",
    ourTeamCanHelp: "Nuestro equipo puede ayudarle a abordar todas las recomendaciones en este informe con soluciones personalizadas.",
    contactOurExperts: "Contacte a Nuestros Expertos",
    exploreSolutions: "Explorar Soluciones Edgecast",
    securityDescription: "La confianza es su moneda más valiosa: una seguridad hermética convierte a los visitantes en clientes seguros.",
    noDataFound: "No se encontraron datos de análisis. Por favor, analice un sitio web primero.",
    backToHome: "Volver al Inicio",
    seoTagline: "Impulsa la descubribilidad—optimiza cómo se encuentra y muestra tu sitio en los resultados de búsqueda.",
    recommendations: {
      performance: "Recomendaciones de Rendimiento",
      seo: "Recomendaciones SEO",
      mobile: "Recomendaciones Móviles",
      security: "Recomendaciones de Seguridad"
    }
  }
};

const SidePanel = styled(Paper)(({ theme }) => ({
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

const MainContent = styled('div')(({ theme }) => ({
  marginLeft: '25%',
  width: '75%',
  padding: theme.spacing(4),
  backgroundColor: '#E0E7F7',
  [theme.breakpoints.down('lg')]: {
    marginLeft: '30%',
    width: '70%'
  },
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

const EdgecastHelpSection = ({ domain, language }) => {
  const t = translations[language];

  return (
    <Box sx={{ mt: 8, mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: 'primary.main',
        textAlign: 'center',
        mb: 4
      }}>
        {t.howEdgecastCanHelp}
      </Typography>
      
      <Card sx={{ 
        backgroundColor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        mb: 4
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
            {t.optimizeWith(domain)}
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            {t.edgecastProvides}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'medium', 
                color: 'primary.main',
                mb: 2,
                display: 'flex',
                alignItems: 'center'
              }}>
                <SpeedIcon sx={{ mr: 1 }} /> {t.performanceSolutions}
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    Content Delivery Network (CDN): Accelerate content delivery globally
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    Edge Compute: Run logic at the edge for faster response times
                  </Typography>
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'medium', 
                color: 'primary.main',
                mb: 2,
                display: 'flex',
                alignItems: 'center'
              }}>
                <ShieldIcon sx={{ mr: 1 }} /> {t.securitySolutions}
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    Web Application Firewall (WAF): Protect against threats
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    DDoS Protection: Mitigate volumetric attacks
                  </Typography>
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              size="large" 
              color="primary"
              sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
              onClick={() => window.open('https://www.edgecast.io/contact-us', '_blank')}
            >
              {t.contactOurExperts}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(state?.language || 'en');
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!state && !isLoading) {
      const savedState = localStorage.getItem('currentAnalysis');
      if (savedState) {
        navigate('.', { state: JSON.parse(savedState), replace: true });
      }
    }
  }, [state, isLoading, navigate]);

  // Destructure backend data with proper fallbacks
  const {
    domain = '',
    scores = {},
    performance = {},
    seo = {},
    mobile = {},
    security = {},
    guid = ''
  } = state || {};
  
  console.log('=== Result.js: Raw Data ===');
  console.log('Scores:', scores);
  console.log('Performance:', performance);
  console.log('SEO:', seo);
  console.log('Mobile:', mobile);
  console.log('Security:', security);

  const performanceData = performance;
  const seoData = seo;
  const mobileData = mobile;
  const securityData = security;

  // Calculate scores with proper fallbacks
  const performanceScore = scores.performance ?? performanceData?.performanceScore ?? 0;
  const seoScore = scores.seo ?? calculateSeoScore(seoData);
  const mobileScore = scores.mobile ?? calculateMobileScore(mobileData);
  const securityScore = scores.security ?? calculateSecurityScore(securityData);
  const overallScore = scores.overall ?? 
    Math.round((performanceScore + seoScore + mobileScore + securityScore) / 4);

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generatePdf(
        domain,
        {
          overall: overallScore,
          performance: performanceScore,
          seo: seoScore,
          mobile: mobileScore,
          security: securityScore
        },
        {
          performance: performanceData,
          seo: seoData,
          mobile: mobileData,
          security: securityData
        },
        language
      );
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  useEffect(() => {
    if (state?.domain) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [state]);

  if (!state || !state.domain) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          {t.noDataFound}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          {t.backToHome}
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Floating Language Toggle Button */}
      <Box sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1300,
        backgroundColor: '#fff',
        borderRadius: '50%',
        boxShadow: 3,
        p: 1
      }}>
        <Tooltip title={language === 'en' ? "Cambiar a Español" : "Switch to English"}>
          <IconButton onClick={toggleLanguage} color="primary" size="small">
            <Translate />
          </IconButton>
        </Tooltip>
      </Box>

      <SidePanel elevation={3}>
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
              
              const encodedGuid = btoa(guid);
              const reportUrl = `${window.location.origin}/share/${encodedGuid}`;
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
          </Box>
        </Box>
      </SidePanel>

      <MainContent id="report-content">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={4} mb={4}>
        <Box display="flex" alignItems="baseline" justifyContent="flex-start" width="100%" maxWidth="1200px" px={2}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mr: 1 }}>
            {t.webPulse}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t.poweredBy}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mt: 3 }}>
        {t.performanceAssessment(performanceScore)}
      </Typography>

      <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mt: 1, maxWidth: 700 }}>
        {t.performanceMotivation}
      </Typography>

        {performanceData?.screenshot && (
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
              src={performanceData.screenshot}
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
        <Suspense fallback={<CircularProgress />}>
        <SectionHeader>
          <img src={SpeedoSVG} alt="Speedometer Icon" style={{ width: 80 }} />
        </SectionHeader>

        <PerformanceSection 
          data={{ ...performanceData, score: performanceScore }} 
          language={language} 
        />
          <RecommendationSection 
            category="performance" 
            performanceData={performanceData} 
            language={language} 
          />

          <SectionHeader>
            <img src={SeoSVG} alt="SEO Icon" style={{ width: 80 }} />
          </SectionHeader>
          <SEOSection 
            seoData={{
              ...seoData,
              score: seoScore
            }} 
            language={language} 
            domain={domain} 
          />
          <RecommendationSection 
            category="seo" 
            seoData={seoData} 
            language={language} 
          />

          <SectionHeader>
            <img src={MobileSVG} alt="Mobile Icon" style={{ width: 80 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t.mobileTitle}
            </Typography>
          </SectionHeader>
          <div id="mobile-section">
            <MobileSection 
              mobile={{
                ...mobileData,
                score: mobileScore
              }} 
              language={language} 
            />
          </div>
          <RecommendationSection 
            category="mobile" 
            mobileData={mobileData} 
            language={language} 
          />

          <SectionHeader>
            <img src={SecuritySVG} alt="Security Icon" style={{ width: 80 }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t.security}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {t.securityDescription}
            </Typography>
          </SectionHeader>
          <div id="security-section">
            <SecuritySection 
              security={{
                ...securityData,
                score: securityScore
              }} 
              language={language} 
            />
          </div>
          <RecommendationSection 
            category="security" 
            securityData={securityData} 
            language={language} 
          />
          
          <EdgecastHelpSection domain={domain} language={language} />
        </Suspense>
      </MainContent>
    </Box>
  );
};

export default Result;