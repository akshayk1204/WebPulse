const { v4: uuidv4 } = require('uuid');
const { getPageSpeed } = require('../services/performanceService');
const { analyzeSEO } = require('../services/seoService');
const { getSecurity } = require('../services/securityService');
const { analyzeMobileMetrics } = require('../services/mobileService');
const { insertReport } = require('../db');

const analyzeDomain = async (req, res) => {
  const { domain, language = 'en' } = req.body;
  if (!domain) return res.status(400).json({ error: 'Domain is required' });

  const sanitizedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  try {
    // Run all tests in parallel
    const [performance, seo, security, mobile] = await Promise.allSettled([
      getPageSpeed(sanitizedDomain),
      analyzeSEO(sanitizedDomain),
      getSecurity(sanitizedDomain),
      analyzeMobileMetrics(sanitizedDomain)
    ]);

    const performanceData = performance.status === 'fulfilled' ? performance.value : {};
    const seoData = seo.status === 'fulfilled' ? seo.value : {};
    const securityData = security.status === 'fulfilled' ? security.value : {};
    const mobileData = mobile.status === 'fulfilled' ? mobile.value : {};

    const scores = {
      performance: performanceData.performanceScore || 0,
      seo: computeSeoScore(seoData),
      mobile: computeMobileScore(mobileData),
      security: computeSecurityScore(securityData)
    };
    scores.overall = Math.round(
      (scores.performance + scores.seo + scores.mobile + scores.security) / 4
    );

    const guid = uuidv4();

    await insertReport({
      guid,
      domain: sanitizedDomain,
      language,
      scores,
      performanceData,
      seoData,
      mobileData,
      securityData
    });

    return res.json({
      guid,
      domain: sanitizedDomain,
      language,
      scores,
      performanceData,
      seoData,
      mobileData,
      securityData
    });

  } catch (error) {
    console.error('Analysis error:', error.message);
    return res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
};

// --- Scoring helpers ---

function computeSeoScore(data) {
  if (data?.error) return 0;
  let score = 0;
  if (data.indexable) score += 25;
  if (data.hasMetaDescription) score += 25;
  if (data.usesCleanContent) score += 25;
  if (data.hasDescriptiveLinks) score += 25;
  return score;
}

function computeMobileScore(data) {
  if (data?.error) return 0;
  let score = 0;
  if (data.responsive) score += 20;
  if (data.viewportMeta) score += 20;
  if (data.tapTargets) score += 20;
  if (data.mobileSpeed) score += 20;
  if (data.fontSizes) score += 10;
  if (data.contentFitting) score += 10;
  return score;
}

function computeSecurityScore(data) {
  if (data?.error) return 0;
  let score = 0;
  if (data.sslStatus === 'Valid') score += 25;
  if (data.https) score += 25;
  if (data.securityHeaders === 'Enabled') score += 20;
  if (data.firewallDetected) score += 15;
  if (data.corsPolicy === 'Restricted') score += 10;
  if (data.cookieSecurity?.secure && data.cookieSecurity?.httpOnly) score += 5;
  return score;
}

module.exports = { analyzeDomain };
