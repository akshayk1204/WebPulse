import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, Container, Alert,
  LinearProgress, Button, Divider, IconButton, Tooltip,
  Paper, Card, CardContent, Grid, List, ListItem, ListItemIcon
} from '@mui/material';
import { styled } from '@mui/system';
import {
  Speed as SpeedIcon,
  Search as SearchIcon,
  Devices as DevicesIcon,
  Shield as ShieldIcon,
  Download as DownloadIcon,
  Translate as TranslateIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import ECLogo from '../assets/EC-logo.svg';
import SpeedoSVG from '../assets/speedo.svg';
import SeoSVG from '../assets/seo.svg';
import MobileSVG from '../assets/mobile.svg';
import SecuritySVG from '../assets/security.svg';
import { calculateSeoScore, calculateMobileScore, calculateSecurityScore, getScoreColor } from '../utils/scoreUtils';
import generatePdf from '../utils/generatePdf';
import Gauge from '../components/Gauge';
import PerformanceSection from '../sections/PerformanceSection';
import SEOSection from '../sections/SEOSection';
import MobileSection from '../sections/MobileSection';
import SecuritySection from '../sections/securitySection';
import RecommendationSection from '../sections/RecommendationSection';

const translations = {
  en: {
    overallScore: "Overall Score",
    performance: "Performance",
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
    performanceMotivation: "Now let's take your site from good to great. See your scorecard below and take action today!",
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

const ReportView = () => {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [language, setLanguage] = useState('en');

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
        if (data.language) {
          setLanguage(data.language);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchReport();
  }, [guid]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

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
        language
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !report) {
    const t = translations[language] || translations.en;
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

  const {
    domain,
    scores = {},
    performance_data = {},
    seo_data = {},
    mobile_data = {},
    security_data = {}
  } = report;

  const t = translations[language] || translations.en;

  // Calculate scores with proper fallbacks
  const performanceScore = scores.performance ?? performance_data?.performanceScore ?? 0;
  const seoScore = scores.seo ?? calculateSeoScore(seo_data);
  const mobileScore = scores.mobile ?? calculateMobileScore(mobile_data);
  const securityScore = scores.security ?? calculateSecurityScore(security_data);
  const overallScore = scores.overall ?? 
    Math.round((performanceScore + seoScore + mobileScore + securityScore) / 4);

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
            <TranslateIcon />
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

      <MainContent id="report-content">
        <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center" mt={4} mb={4}>
          <Box display="flex" alignItems="baseline" justifyContent="flex-start" width="100%" maxWidth="1200px" px={2}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mr: 1 }}>
              {t.webPulse}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t.poweredBy}
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'left', mt: 3 }}>
            {t.performanceAssessment(performanceScore)}
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'left', mt: 1, maxWidth: 700 }}>
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
              boxShadow: 3
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
        </SectionHeader>
        <PerformanceSection 
          data={{ ...performance_data, score: performanceScore }} 
          language={language} 
        />
        <RecommendationSection 
          category="performance" 
          performanceData={performance_data} 
          language={language} 
        />

        <SectionHeader>
          <img src={SeoSVG} alt="SEO Icon" style={{ width: 80 }} />
        </SectionHeader>
        <SEOSection 
          data={{ ...seo_data, score: seoScore }} 
          language={language} 
          domain={domain} 
        />
        <RecommendationSection 
          category="seo" 
          seoData={seo_data} 
          language={language} 
        />

        <SectionHeader>
          <img src={MobileSVG} alt="Mobile Icon" style={{ width: 80 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t.mobile}
          </Typography>
        </SectionHeader>
        <MobileSection 
          data={{ ...mobile_data, score: mobileScore }} 
          language={language} 
        />
        <RecommendationSection 
          category="mobile" 
          mobileData={mobile_data} 
          language={language} 
        />

        <SectionHeader>
          <img src={SecuritySVG} alt="Security Icon" style={{ width: 80 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t.security}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t.securityDescription}
          </Typography>
        </SectionHeader>
        <SecuritySection 
          data={{ ...security_data, score: securityScore }} 
          language={language} 
        />
        <RecommendationSection 
          category="security" 
          securityData={security_data} 
          language={language} 
        />
        
        <EdgecastHelpSection domain={domain} language={language} />
      </MainContent>
    </Box>
  );
};

export default ReportView;