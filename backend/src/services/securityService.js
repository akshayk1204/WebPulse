const axios = require('axios');
const sslChecker = require('ssl-checker');

const getSecurity = async (domain) => {
  try {
    const sslResult = await sslChecker(domain);
    const headers = await axios.get(`https://${domain}`);

    const securityHeaders = headers.data.includes('Strict-Transport-Security') ? 'Enabled' : 'Not Enabled';

    return {
      sslStatus: sslResult.isValid ? 'Valid' : 'Invalid',
      https: sslResult.isSecure,
      securityHeaders,
    };
  } catch (error) {
    console.error("❌ Security fetch error:", error.message);
    throw new Error('Failed to fetch security data');
  }
};

module.exports = { getSecurity };
