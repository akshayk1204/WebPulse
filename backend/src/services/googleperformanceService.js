const axios = require('axios');
const { getDomainTestInfo, insertDomainTest } = require('../db');
require('dotenv').config();

const PSI_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
const PSI_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const getPageSpeed = async (domain) => {
  if (!PSI_API_KEY) throw new Error('Google PageSpeed API key missing');

  const domainInfo = await getDomainTestInfo(domain);
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  if (domainInfo && domainInfo.last_run > twoMonthsAgo) {
    console.log(`Using existing test results for ${domain} (Test ID: ${domainInfo.test_id})`);
    try {
      const result = await fetchPageSpeed(domainInfo.test_id);
      const formattedResults = formatPageSpeedResults(result);
      if (!formattedResults.performanceScore) throw new Error('Missing performance score');
      return formattedResults;
    } catch (error) {
      console.error('Error using cached PageSpeed result:', error.message);
      return { error: 'Failed to use cached PageSpeed result', details: error.message };
    }
  }

  console.log(`Running new test for ${domain}`);
  try {
    const result = await fetchPageSpeed(domain);
    const newTestId = domain; // domain acts as ID for PageSpeed API
    await insertDomainTest(domain, newTestId);

    const formattedResults = formatPageSpeedResults(result);
    if (!formattedResults.performanceScore) throw new Error('Missing performance score');

    console.log(`Successfully fetched new PageSpeed results for ${domain}`);
    return formattedResults;
  } catch (error) {
    console.error('Error running new PageSpeed test:', error.message);
    return { error: 'Failed to get PageSpeed data', details: error.message };
  }
};

const fetchPageSpeed = async (url) => {
  const response = await axios.get(PSI_URL, {
    params: {
      url,
      key: PSI_API_KEY,
      strategy: 'desktop', // Use 'mobile' if needed
      category: ['performance']
    },
    timeout: 15000
  });

  return response.data;
};

const formatPageSpeedResults = (data) => {
  try {
    const audits = data.lighthouseResult.audits;
    const metrics = data.lighthouseResult.audits.metrics?.details?.items?.[0] || {};

    return {
      performanceScore: Math.round(data.lighthouseResult.categories.performance.score * 100),
      firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue || 0,
      timeToInteractive: audits['interactive']?.numericValue || 0,
      pageSize: (audits['total-byte-weight']?.numericValue || 0) / (1024 * 1024),
      pageRequests: audits['network-requests']?.details?.items?.length || 0,
      screenshot: data.lighthouseResult.audits['final-screenshot']?.details?.data || null,
      source: 'PageSpeedInsights'
    };
  } catch (error) {
    console.error('Error formatting PageSpeed data:', error.message);
    return { error: 'Failed to parse PageSpeed results' };
  }
};

const calculatePerformanceScore = (metrics = {}) => {
  const weights = {
    firstContentfulPaint: 0.3,
    speedIndex: 0.25,
    timeToInteractive: 0.25,
    pageSize: 0.1,
    pageRequests: 0.1
  };

  const normalized = {
    firstContentfulPaint: Math.min(100, Math.max(0, 100 - ((metrics.firstContentfulPaint || 3000) / 100))),
    speedIndex: Math.min(100, Math.max(0, 100 - ((metrics.speedIndex || 3000) / 100))),
    timeToInteractive: Math.min(100, Math.max(0, 100 - (Math.round(metrics.timeToInteractive || 5000) / 2000))),
    pageSize: Math.min(100, Math.max(0, 100 - ((metrics.pageSize || 3.5) * 10))),
    pageRequests: Math.min(100, Math.max(0, 100 - ((metrics.pageRequests || 80) / 2)))
  };

  let score = 0;
  for (const [metric, weight] of Object.entries(weights)) {
    score += (normalized[metric] || 0) * weight;
  }

  return Math.round(score);
};

module.exports = {
  getPageSpeed,
  calculatePerformanceScore
};
