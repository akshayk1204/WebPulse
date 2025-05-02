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

    console.log('✅ PageSpeed data successfully fetched');

    return {
      performanceScore: data.lighthouseResult.categories.performance.score,
      firstContentfulPaint: data.lighthouseResult.audits['first-contentful-paint'].displayValue,
      speedIndex: data.lighthouseResult.audits['speed-index'].displayValue,
      timeToInteractive: data.lighthouseResult.audits['interactive'].displayValue,
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
