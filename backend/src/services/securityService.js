const axios = require('axios');
const sslChecker = require('ssl-checker');

const getSecurity = async (domain) => {
  try {
    // First check if HTTPS is available
    let httpsAvailable = false;
    try {
      await axios.head(`https://${domain}`, { timeout: 5000 });
      httpsAvailable = true;
    } catch (httpsError) {
      httpsAvailable = false;
    }

    // Only check SSL if HTTPS is available
    let sslResult = { isValid: false };
    if (httpsAvailable) {
      sslResult = await sslChecker(domain, { method: 'GET', timeout: 5000 });
    }

    // Check security headers
    let securityHeaders = 'Not checked';
    try {
      const headersResponse = await axios.get(`https://${domain}`, { timeout: 5000 });
      securityHeaders = headersResponse.headers['strict-transport-security'] ? 'Enabled' : 'Disabled';
    } catch (headersError) {
      securityHeaders = 'Check failed';
    }

    return {
      sslStatus: sslResult.isValid ? 'Valid' : 'Invalid',
      https: httpsAvailable,
      securityHeaders,
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    console.error("❌ Security fetch error:", error.message);
    return {
      error: 'Security check failed',
      details: error.message,
      sslStatus: 'Error',
      https: false,
      securityHeaders: 'Error'
    };
  }
};

module.exports = { getSecurity };