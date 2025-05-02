const axios = require('axios');
require('dotenv').config();

const getPageSpeed = async (domain) => {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;

  if (!apiKey) {
    console.error("❌ Google PageSpeed API Key is missing in the .env file");
    throw new Error('Missing Google PageSpeed API Key');
  }

  const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://${domain}&key=${apiKey}`;

  try {
    console.log(`🔄 Fetching PageSpeed data for: https://${domain}`);

    const response = await axios.get(url, { timeout: 14000 }); // 👈 Only this call gets a longer timeout
    const data = response.data;

    if (!data.lighthouseResult) {
      throw new Error('No Lighthouse data found in the response');
    }
    
    const getPassFailBadge = (score) => {
        if (score >= 80) return { label: 'Pass', color: 'success.main' };
        if (score <= 40) return { label: 'Fail', color: 'error.main' };
        return null;
      };

    console.log('✅ PageSpeed data successfully fetched');
    const totalBytes = data.lighthouseResult.audits['total-byte-weight']?.numericValue || 0;
    const totalRequests = data.lighthouseResult.audits['network-requests']?.details?.items?.length || 0;

    return {
        performanceScore: Math.round(data.lighthouseResult.categories.performance.score * 100),
        firstContentfulPaint: (data.lighthouseResult.audits['first-contentful-paint'].numericValue / 1000).toFixed(2),
        speedIndex: (data.lighthouseResult.audits['speed-index'].numericValue / 1000).toFixed(2),
        timeToInteractive: (data.lighthouseResult.audits['interactive'].numericValue / 1000).toFixed(2),
        pageSize: (totalBytes / (1024 * 1024)).toFixed(2), // Convert bytes to MB
        pageRequests: totalRequests
      };   
  } catch (error) {
    console.error("❌ PageSpeed fetch error:", error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw new Error('Failed to fetch PageSpeed data');
  }
};

module.exports = { getPageSpeed };
