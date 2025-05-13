const { v4: uuidv4 } = require('uuid');
const { getPageSpeed } = require('../services/performanceService');
const { analyzeSEO } = require('../services/seoService');
const { getSecurity } = require('../services/securityService');
const { analyzeMobileMetrics } = require('../services/mobileService');
const { insertReport, getReportByGuid } = require('../db');

const analyzeDomain = async (req, res) => {
  const { domain, language = 'en' } = req.body;
  
  // Validate input
  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ 
      status: 'error',
      error: 'Valid domain is required',
      timestamp: new Date().toISOString()
    });
  }

  const sanitizedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
  
  try {
    console.log(`Starting analysis for domain: ${sanitizedDomain}`);
    
    // Execute all analysis in parallel
    const [performance, seo, security, mobile] = await Promise.allSettled([
      getPageSpeed(sanitizedDomain),
      analyzeSEO(sanitizedDomain),
      getSecurity(sanitizedDomain),
      analyzeMobileMetrics(sanitizedDomain)
    ]);

    // Process results with error fallbacks
    const results = {
      performance: performance.status === 'fulfilled' ? performance.value : { 
        error: 'Performance analysis failed',
        performanceScore: 0 
      },
      seo: seo.status === 'fulfilled' ? seo.value : { 
        error: 'SEO analysis failed' 
      },
      security: security.status === 'fulfilled' ? security.value : { 
        error: 'Security analysis failed' 
      },
      mobile: mobile.status === 'fulfilled' ? mobile.value : { 
        error: 'Mobile analysis failed' 
      }
    };

    // Calculate scores with fallbacks
    const scores = {
      performance: results.performance.performanceScore || 0,
      seo: computeSeoScore(results.seo),
      mobile: computeMobileScore(results.mobile),
      security: computeSecurityScore(results.security),
      overall: 0
    };
    scores.overall = Math.round(
      (scores.performance + scores.seo + scores.mobile + scores.security) / 4
    );

    // Generate and verify report persistence
    const guid = uuidv4();
    const reportPayload = {
      guid,
      domain: sanitizedDomain,
      language,
      scores,
      performanceData: results.performance,
      seoData: results.seo,
      mobileData: results.mobile,
      securityData: results.security
    };

    console.log(`Attempting to store report for GUID: ${guid}`);
    const insertedGuid = await insertReport(reportPayload);
    
    // Verify the report was actually stored
    const dbReport = await getReportByGuid(insertedGuid);
    if (!dbReport) {
      throw new Error('Report verification failed - not found in database');
    }
    console.log(`Successfully stored report for GUID: ${insertedGuid}`);

    return res.json({
      status: 'success',
      guid: insertedGuid,
      domain: sanitizedDomain,
      language,
      scores,
      performanceData: results.performance,
      seoData: results.seo,
      mobileData: results.mobile,
      securityData: results.security,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis pipeline failed:', {
      domain: sanitizedDomain,
      error: error.message,
      stack: error.stack
    });
    
    return res.status(500).json({
      status: 'error',
      error: 'Analysis failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

// --- Scoring helpers with enhanced validation ---

function computeSeoScore(data) {
  if (!data || data?.error) return 0;
  
  let score = 0;
  const checks = [
    { condition: data.indexable, points: 25 },
    { condition: data.hasMetaDescription, points: 25 },
    { condition: data.usesCleanContent, points: 25 },
    { condition: data.hasDescriptiveLinks, points: 25 }
  ];
  
  checks.forEach(({ condition, points }) => {
    if (condition) score += points;
  });
  
  return Math.min(score, 100); // Ensure score doesn't exceed 100
}

function computeMobileScore(data) {
  if (!data || data?.error) return 0;
  
  let score = 0;
  const checks = [
    { condition: data.responsive, points: 20 },
    { condition: data.viewportMeta, points: 20 },
    { condition: data.tapTargets, points: 20 },
    { condition: data.mobileSpeed, points: 20 },
    { condition: data.fontSizes, points: 10 },
    { condition: data.contentFitting, points: 10 }
  ];
  
  checks.forEach(({ condition, points }) => {
    if (condition) score += points;
  });
  
  return Math.min(score, 100);
}

function computeSecurityScore(data) {
  if (!data || data?.error) return 0;
  
  let score = 0;
  const checks = [
    { condition: data.sslStatus === 'Valid', points: 25 },
    { condition: data.https, points: 25 },
    { condition: data.securityHeaders === 'Enabled', points: 20 },
    { condition: data.firewallDetected, points: 15 },
    { condition: data.corsPolicy === 'Restricted', points: 10 },
    { 
      condition: data.cookieSecurity?.secure && data.cookieSecurity?.httpOnly, 
      points: 5 
    }
  ];
  
  checks.forEach(({ condition, points }) => {
    if (condition) score += points;
  });
  
  return Math.min(score, 100);
}

module.exports = { analyzeDomain };