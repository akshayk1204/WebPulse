import React, { useState, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, LinearProgress, Alert,
  CircularProgress, Grid, Card, CardContent, List, ListItem, ListItemIcon, Divider,
  IconButton, Tooltip, AppBar, Toolbar
} from '@mui/material';
import { styled } from '@mui/system';
import { Translate } from '@mui/icons-material';
import Gauge from '../components/Gauge';
import { calculateSeoScore, getScoreColor, calculateMobileScore, calculateSecurityScore } from '../utils/scoreUtils';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import ShieldIcon from '@mui/icons-material/Shield';
import DevicesIcon from '@mui/icons-material/Devices';
import PublicIcon from '@mui/icons-material/Public';
//import SEOSection from '../components/SEOSection';
import SecuritySection from '../sections/securitySection';
//import RecommendationSection from '../sections/RecommendationSection';
const PerformanceSection = React.lazy(() => import('../sections/PerformanceSection'));
const SEOSection = React.lazy(() => import('../sections/SEOSection'));
const MobileSection = React.lazy(() => import('../sections/MobileSection'));
//const SecuritySection = React.lazy(() => import('../sections/securitySection'));
const RecommendationSection = React.lazy(() => import('../sections/RecommendationSection'));

// Translation dictionaries
const translations = {
  en: {
    overallScore: "Overall Score",
    performance: "PERFORMANCE",
    mobileTitle: "Mobile Optimization",
    seo: "SEO",
    mobile: "MOBILE",
    security: "SECURITY",
    webPulse: "WebPulse",
    poweredBy: "powered by Edgecast",
    websiteAnalysis: "Website Analysis",
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

    seoTagline: "Boost discoverability—optimize how your site is found and displayed in search results.", // Add this
    solutions: {
      cdn: "Content Delivery Network (CDN): Accelerate content delivery globally with our high-performance CDN",
      edgeCompute: "Edge Compute: Run logic at the edge for faster response times and reduced origin load",
      imageOptimization: "Image Optimization: Automatic image compression and format conversion",
      waf: "Web Application Firewall (WAF): Protect against OWASP Top 10 threats and DDoS attacks",
      botManagement: "Bot Management: Detect and mitigate malicious bot traffic",
      apiSecurity: "API Security: Protect your APIs from abuse and attacks",
      attackSurface: "Attack Surface Management: Continuously discover, monitor, and reduce your digital attack surface",
      adaptiveMedia: "Adaptive Media Delivery: Optimize content for each device type and connection speed",
      dynamicImageOptimization: "Image Optimization: Dynamic compression, format conversion (WebP/AVIF), and responsive breakpoints",
      rum: "Real User Monitoring (RUM): Correlate performance metrics with device types and networks",
      pointsOfPresence: "50+ Points of Presence: Worldwide network for low-latency delivery",
      uptimeSla: "100% Uptime SLA: Enterprise-grade reliability",
      trustedByEnterprises: "Our solutions are trusted by leading enterprises worldwide to deliver secure, high-performance digital experiences."
    }
  },
  es: {
    overallScore: "Puntuación General",
    performance: "RENDIMIENTO",
    seo: "SEO",
    mobile: "MÓVIL",
    mobileTitle: "Optimización Móvil",
    security: "SEGURIDAD",
    webPulse: "WebPulse",
    poweredBy: "con tecnología de Edgecast",
    websiteAnalysis: "Análisis de Sitio Web",
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
    seoTagline: "Impulsa la descubribilidad—optimiza cómo se encuentra y muestra tu sitio en los resultados de búsqueda.", // Add this
    solutions: {
      cdn: "Red de Entrega de Contenido (CDN): Acelera la entrega de contenido globalmente con nuestra CDN de alto rendimiento",
      edgeCompute: "Edge Compute: Ejecuta lógica en el edge para tiempos de respuesta más rápidos y menor carga en el origen",
      imageOptimization: "Optimización de Imágenes: Compresión automática de imágenes y conversión de formatos",
      waf: "Firewall de Aplicaciones Web (WAF): Protege contra las 10 principales amenazas OWASP y ataques DDoS",
      botManagement: "Gestión de Bots: Detecta y mitiga tráfico malicioso de bots",
      apiSecurity: "Seguridad de API: Protege tus APIs de abusos y ataques",
      attackSurface: "Gestión de Superficie de Ataque: Descubre, monitorea y reduce continuamente tu superficie de ataque digital",
      adaptiveMedia: "Entrega de Medios Adaptativa: Optimiza contenido para cada tipo de dispositivo y velocidad de conexión",
      dynamicImageOptimization: "Optimización de Imágenes: Compresión dinámica, conversión de formatos (WebP/AVIF) y puntos de interrupción responsivos",
      rum: "Monitoreo de Usuarios Reales (RUM): Correlaciona métricas de rendimiento con tipos de dispositivos y redes",
      pointsOfPresence: "50+ Puntos de Presencia: Red mundial para entrega de baja latencia",
      uptimeSla: "SLA de 100% Tiempo de Actividad: Confiabilidad de nivel empresarial",
      trustedByEnterprises: "Nuestras soluciones son utilizadas por empresas líderes en todo el mundo para ofrecer experiencias digitales seguras y de alto rendimiento."
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
  backgroundColor: '#E0E7F7 ',
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
                    <strong>{t.solutions.cdn.split(':')[0]}:</strong> {t.solutions.cdn.split(':')[1].trim()}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    <strong>{t.solutions.edgeCompute.split(':')[0]}:</strong> {t.solutions.edgeCompute.split(':')[1].trim()}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    <strong>{t.solutions.imageOptimization.split(':')[0]}:</strong> {t.solutions.imageOptimization.split(':')[1].trim()}
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
                    <strong>{t.solutions.waf.split(':')[0]}:</strong> {t.solutions.waf.split(':')[1].trim()}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    <strong>{t.solutions.botManagement.split(':')[0]}:</strong> {t.solutions.botManagement.split(':')[1].trim()}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    <strong>{t.solutions.apiSecurity.split(':')[0]}:</strong> {t.solutions.apiSecurity.split(':')[1].trim()}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    <strong>{t.solutions.attackSurface.split(':')[0]}:</strong> {t.solutions.attackSurface.split(':')[1].trim()}
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
                <DevicesIcon sx={{ mr: 1 }} /> {t.mobileOptimization}
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    <strong>{t.solutions.adaptiveMedia.split(':')[0]}:</strong> {t.solutions.adaptiveMedia.split(':')[1].trim()}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    <strong>{t.solutions.dynamicImageOptimization.split(':')[0]}:</strong> {t.solutions.dynamicImageOptimization.split(':')[1].trim()}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    <strong>{t.solutions.rum.split(':')[0]}:</strong> {t.solutions.rum.split(':')[1].trim()}
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
                <PublicIcon sx={{ mr: 1 }} /> {t.globalInfrastructure}
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    {t.solutions.pointsOfPresence}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">
                    {t.solutions.uptimeSla}
                  </Typography>
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="body1" paragraph sx={{ mb: 2 }}>
            {t.solutions.trustedByEnterprises}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: 4
          }}>
            <Button 
              variant="contained" 
              size="large" 
              color="primary"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
              onClick={() => window.open('https://www.edgecast.io/contact-us', '_blank')}
            >
              {t.contactOurExperts}
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      <Box sx={{ 
        backgroundColor: 'primary.main', 
        color: 'common.white',
        p: 4,
        borderRadius: 2,
        textAlign: 'center'
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
          {t.readyToImplement}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {t.ourTeamCanHelp}
        </Typography>
        <Button 
          variant="contained" 
          color="secondary"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: '1.1rem'
          }}
          onClick={() => window.open('https://www.edgecast.io', '_blank')}
        >
          {t.exploreSolutions}
        </Button>
      </Box>
    </Box>
  );
};

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [performanceData] = useState(state?.performance || null);

  const domain = state?.domain;
  const seoData = state?.seo?.data || state?.seo || {};
  const securityData = state?.security?.data || state?.security || {};
  const mobileData = state?.mobile?.data || state?.mobile || {};
  
  console.log("Security data in Result.js:", securityData);

  const performanceScore = performanceData?.performanceScore || 0;
  const seoScore = calculateSeoScore(seoData);
  const mobileScore = calculateMobileScore(mobileData);
  const securityScore = calculateSecurityScore(securityData);
  const overallScore = Math.round((performanceScore + seoScore + mobileScore + securityScore) / 4);

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  if (!state || !state.domain) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          {t.noDataFound}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>{t.backToHome}</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      <AppBar position="fixed" color="transparent" elevation={0} sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Tooltip title={language === 'en' ? "Cambiar a Español" : "Switch to English"}>
            <IconButton onClick={toggleLanguage} color="inherit">
              <Translate />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {language === 'en' ? 'ES' : 'EN'}
              </Typography>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <SidePanel elevation={3}>
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 600 }}>{domain}</Typography>
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
              { label: t.performance, score: performanceScore },
              { label: t.seo, score: seoScore },
              { label: t.mobile, score: mobileScore },
              { label: t.security, score: securityScore }
            ].map((item, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ color: '#fff' }}>{item.label}</Typography>
                  <Typography variant="h6" sx={{ color: '#fff' }}>{item.score}/100</Typography>
                </Box>
                <LinearProgress variant="determinate" value={item.score} sx={{ 
                  height: 8, 
                  backgroundColor: 'rgba(255,255,255,0.3)', 
                  '& .MuiLinearProgress-bar': { backgroundColor: getScoreColor(item.score) } 
                }} />
              </Box>
            ))}
          </Box>
        </Box>
      </SidePanel>

      <MainContent id="report-content">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mt={4}
          mb={4}
        >
          <Box
            display="flex"
            alignItems="baseline"
            justifyContent="flex-start"
            width="100%"
            maxWidth="1200px"
            px={2}
          >
            <Typography variant="h3" sx={{ fontWeight: 'bold', mr: 1 }}>
              {t.webPulse}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t.poweredBy}
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{ fontWeight: 'medium', textAlign: 'center', mt: 3 }}
          >
            {t.websiteAnalysis}
          </Typography>
        </Box>

        <Suspense fallback={<CircularProgress />}>
          <SectionHeader>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t.performanceTitle}
            </Typography>
          </SectionHeader>
          <div id="performance-section">
           <PerformanceSection data={performanceData} language={language} />
          </div>



          <SEOSection seoData={seoData} language={language} domain={domain} />

          <SectionHeader>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t.mobileTitle}
            </Typography>
          </SectionHeader>
          <div id="mobile-section">
            <MobileSection mobile={mobileData} language={language} />
          </div>

          <SectionHeader>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {t.security}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {t.securityDescription}
            </Typography>
          </SectionHeader>
          <div id="security-section">
            <SecuritySection security={securityData} language={language} />
          </div>
          
          <div id="recommendation-section">
            <RecommendationSection
              performanceData={performanceData}
              seoData={seoData}
              mobileData={mobileData}
              securityData={securityData}
              language={language}
            />
          </div>

          <EdgecastHelpSection domain={domain} language={language} />
        </Suspense>
      </MainContent>
    </Box>
  );
};

export default Result;