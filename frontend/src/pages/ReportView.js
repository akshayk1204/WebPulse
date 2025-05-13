import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Container, Alert } from '@mui/material';
import SidePanel from '../components/SidePanel';
import PerformanceSection from '../sections/PerformanceSection';
import RecommendationSection from '../sections/RecommendationSection';
import SEOSection from '../sections/SEOSection';
import MobileSection from '../sections/MobileSection';
import SecuritySection from '../sections/securitySection';


const translations = {
    en: {
      overallScore: "Overall Score",
      performance: "Performance",
      seo: "SEO",
      mobile: "Mobile",
      security: "Security"
    },
    es: {
      overallScore: "Puntuación General",
      performance: "Rendimiento",
      seo: "SEO",
      mobile: "Móvil",
      security: "Seguridad"
    }
  };

const ReportView = () => {
  const { guid } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/report/${guid}`, {
          headers: {
            'Accept': 'application/json' // Explicitly request JSON
          }
        });
        
        // Check content type before parsing
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
        <Alert severity="error">{error || 'Report not found'}</Alert>
      </Container>
    );
  }

  const {
    domain,
    scores,
    performance_data,
    seo_data,
    mobile_data,
    security_data,
    language = 'en'
  } = report;

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#E0E7F7' }}>
      <SidePanel
        domain={domain}
        overallScore={scores.overall}
        performanceScore={scores.performance}
        seoScore={scores.seo}
        mobileScore={scores.mobile}
        securityScore={scores.security}
        hideShareButton
        translations={translations}
        language={language}
      />

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          WebPulse Report - {domain}
        </Typography>

        <PerformanceSection data={performance_data} language={language} />
        <RecommendationSection 
          category="performance" 
          performanceData={performance_data} 
          language={language} 
        />

        <SEOSection data={seo_data} language={language} />
        <RecommendationSection 
          category="seo" 
          seoData={seo_data} 
          language={language} 
        />

        <MobileSection data={mobile_data} language={language} />
        <RecommendationSection 
          category="mobile" 
          mobileData={mobile_data} 
          language={language} 
        />

        <SecuritySection data={security_data} language={language} />
        <RecommendationSection 
          category="security" 
          securityData={security_data} 
          language={language} 
        />
      </Box>
    </Box>
  );
};

export default ReportView;
