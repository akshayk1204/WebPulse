const { getPageSpeed } = require('../services/performanceService');
const { getSEO } = require('../services/seoService');
const { getSecurity } = require('../services/securityService');

const analyzeDomain = async (req, res) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  const sanitizedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  try {
    // Perform the analysis in parallel for performance, SEO, and security
    const [performance, seo, security] = await Promise.all([
      getPageSpeed(sanitizedDomain),
      getSEO(sanitizedDomain),
      getSecurity(sanitizedDomain),
    ]);

    // Return the collected data
    return res.json({ performance, seo, security });
  } catch (error) {
    console.error('❌ Error during full analysis:', error.message);
    return res.status(500).json({ error: 'Failed to fetch analysis data' });
  }
};

module.exports = { analyzeDomain };
