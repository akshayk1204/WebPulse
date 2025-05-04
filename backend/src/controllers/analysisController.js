const { getPageSpeed } = require('../services/performanceService');
const { analyzeSEO } = require('../services/seoService');
const { getSecurity } = require('../services/securityService');
const { analyzeMobileMetrics } = require('../services/mobileService');

const analyzeDomain = async (req, res) => {
  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: 'Domain is required' });

  const sanitizedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  try {
    // Run all analyses in parallel
    const [performance, seo, security, mobile] = await Promise.allSettled([
      getPageSpeed(sanitizedDomain),
      analyzeSEO(sanitizedDomain),
      getSecurity(sanitizedDomain),
      analyzeMobileMetrics(sanitizedDomain)
    ]);

    // Prepare response with consistent structure
    const response = {
      domain: sanitizedDomain,
      performance: performance.status === 'fulfilled' ? performance.value : { error: performance.reason?.message },
      seo: seo.status === 'fulfilled' ? seo.value : { error: seo.reason?.message },
      security: security.status === 'fulfilled' ? security.value : { error: security.reason?.message },
      mobile: mobile.status === 'fulfilled' ? mobile.value : { error: mobile.reason?.message },
      timestamp: new Date().toISOString()
    };

    return res.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: 'Analysis failed',
      details: error.message 
    });
  }
};

module.exports = { analyzeDomain };