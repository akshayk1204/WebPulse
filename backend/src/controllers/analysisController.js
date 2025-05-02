const { getPageSpeed } = require('../services/performanceService');
const { getSEO } = require('../services/seoService');
const { getSecurity } = require('../services/securityService');
const timeout = require('../utils/timeoutPromise');


const analyzeDomain = async (req, res) => {
  const { domain } = req.body;
  const sanitizedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  try {
    const [performance, seo, security] = await Promise.allSettled([
      timeout(getPageSpeed(sanitizedDomain), 25000, 'Performance timeout'),
      timeout(getSEO(sanitizedDomain), 8000, 'SEO timeout'),
      timeout(getSecurity(sanitizedDomain), 10000, 'Security timeout'),
    ]);

    return res.json({
      performance: performance.status === 'fulfilled' ? performance.value : { error: performance.reason.message },
      seo: seo.status === 'fulfilled' ? seo.value : { error: seo.reason.message },
      security: security.status === 'fulfilled' ? security.value : { error: security.reason.message },
    });
  } catch (error) {
    console.error('❌ Unexpected error during full analysis:', error);
    return res.status(500).json({ error: 'Failed to fetch analysis data' });
  }
};

module.exports = { analyzeDomain };
