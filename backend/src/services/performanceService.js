const axios = require('axios');
require('dotenv').config();

const PSI_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
const PSI_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const DEFAULT_VALUES = {
  performanceScore: 85,
  firstContentfulPaint: '1.2s',
  largestContentfulPaint: '2.5s',
  timeToFirstByte: '0.5s',
  cumulativeLayoutShift: '0.05',
  interactionToNextPaint: '2.0s',
  screenshot: null,
  source: 'DefaultValues'
};

const getPageSpeed = async (domain) => {
  if (!PSI_API_KEY) {
    throw new Error('Google PageSpeed API key missing');
  }

  if (isYahooDomain(domain)) {
    console.log(`Yahoo domain detected (${domain}), returning default values`);
    return DEFAULT_VALUES;
  }

  try {
    const result = await fetchPageSpeed(domain);
    const formattedResults = formatPageSpeedResults(result);

    if (!formattedResults.performanceScore) {
      throw new Error('Missing performance score from PSI response');
    }

    console.log(`Successfully fetched new PageSpeed results for ${domain}`);
    return formattedResults;
  } catch (error) {
    const msg = error.response?.data?.error?.message || error.message;
    console.error('Error running PageSpeed test:', msg);
    return {
      error: 'Failed to get PageSpeed data',
      details: msg
    };
  }
};

const isYahooDomain = (domain) => {
  const yahooDomains = [
    'yahoo.com', 'yahoo.net', 'yahoofinance.com',
    'yahoosports.com', 'yahoomail.com', 'flickr.com'
  ];

  try {
    const hostname = new URL(domain.startsWith('http') ? domain : `https://${domain}`).hostname;
    const baseDomain = hostname.split('.').slice(-2).join('.');
    return yahooDomains.includes(baseDomain);
  } catch (e) {
    return false;
  }
};

const fetchPageSpeed = async (url) => {
  const fullUrl = url.startsWith('http') ? url : `https://${url}`;

  const response = await axios.get(PSI_URL, {
    params: {
      url: fullUrl,
      key: PSI_API_KEY,
      strategy: 'desktop',
      category: ['performance']
    },
    timeout: 180000
  });

  return response.data;
};

const formatSeconds = (ms) => (ms ? (ms / 1000).toFixed(1) + 's' : 'N/A');
const formatCLS = (val) => (val !== undefined ? val.toFixed(2) : 'N/A');

const formatPageSpeedResults = (data) => {
  try {
    const audits = data.lighthouseResult.audits;

    return {
      performanceScore: Math.round(data.lighthouseResult.categories.performance.score * 100),
      firstContentfulPaint: formatSeconds(audits['first-contentful-paint']?.numericValue),
      largestContentfulPaint: formatSeconds(audits['largest-contentful-paint']?.numericValue),
      timeToFirstByte: formatSeconds(audits['server-response-time']?.numericValue),
      cumulativeLayoutShift: formatCLS(audits['cumulative-layout-shift']?.numericValue),
      interactionToNextPaint: formatSeconds(audits['experimental-interaction-to-next-paint']?.numericValue),
      screenshot: audits['final-screenshot']?.details?.data || null,
      //source: 'PageSpeedInsights'
    };
  } catch (error) {
    console.error('Error formatting PageSpeed data:', error.message);
    return { error: 'Failed to parse PageSpeed results' };
  }
};

module.exports = {
  getPageSpeed,
  isYahooDomain
};
