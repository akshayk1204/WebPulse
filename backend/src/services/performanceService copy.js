const axios = require('axios');
const { getDomainTestInfo, insertDomainTest } = require('../db');
require('dotenv').config();

const WPT_API_KEY = process.env.WEBPAGETEST_API_KEY;
const WPT_TEST_URL = 'https://www.webpagetest.org/runtest.php';
const WPT_RESULT_URL = 'https://www.webpagetest.org/jsonResult.php';

const getPageSpeed = async (domain) => {
  if (!WPT_API_KEY) throw new Error('WebPageTest API key missing');

  // Check if the domain already has test results in the database
  const domainInfo = await getDomainTestInfo(domain);
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  if (domainInfo && domainInfo.last_run > twoMonthsAgo) {
    console.log(`Using existing test results for ${domain} (Test ID: ${domainInfo.test_id})`);

    try {
      const result = await axios.get(WPT_RESULT_URL, {
        params: {
          test: domainInfo.test_id,
          f: 'json'
        },
        headers: {
          'X-WPT-API-KEY': WPT_API_KEY
        },
        timeout: 15000
      });

      if (result.data.statusCode >= 400) {
        throw new Error(result.data.statusText);
      }

      // Ensure results are valid and return them
      const formattedResults = formatWebPageTestResults(result.data.data);
      if (!formattedResults.performanceScore) {
        throw new Error('Invalid WebPageTest results: Missing performance score');
      }

      console.log(`Successfully fetched test results for ${domain}`);
      return formattedResults;

    } catch (error) {
      console.error('Error fetching test results:', error.message);
      return {
        error: 'Failed to get WebPageTest data',
        details: error.response?.data || error.message
      };
    }
  } else {
    console.log(`Running new test for ${domain}`);
    try {
      const testResponse = await axios.get(WPT_TEST_URL, {
        params: {
            url: domain,
            f: 'json',
            k: WPT_API_KEY,
            // Performance optimizations
            runs: 1,
            firstViewOnly: 1,
            // Data collection optimizations
            lighthouse: 1,
            noHeaders: 1,
            noScript: 1,
            timeline: 0,
            netlog: 0,
            bodies: 0,
            tcpdump: 0,
            continuousVideo: 0,
            // Visuals
            screenshot: 1,
            thumbsize: 100,
            // Specific metrics needed
            metrics: 'lighthouse,firstContentfulPaint,SpeedIndex,fullyLoaded,bytesIn,requests',
            // Optional location/connectivity settings
            location: 'Dulles:Chrome',
            connectivity: 'Cable'
        },
        timeout: 15000
      });

      const newTestId = testResponse.data.data.testId;
      
      // Insert the new test result into the database
      const newDomainInfo = await insertDomainTest(domain, newTestId);
      
      const waitForTestResults = async (testId) => {
        const maxAttempts = 10;
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          try {
            const res = await axios.get(WPT_RESULT_URL, {
              params: { test: testId, f: 'json' },
              headers: { 'X-WPT-API-KEY': WPT_API_KEY },
              timeout: 10000,
            });
      
            if (res.data.statusCode === 200 && res.data.data.median?.firstView) {
              return res.data.data;
            }
      
            // Handle specific status codes
            if (res.data.statusCode === 403) {
              throw new Error('Rate limit reached, please wait before retrying.');
            }
          } catch (error) {
            console.error('Error fetching test results:', error.message);
          }
      
          await delay(5000); // wait 5 seconds before retry
        }
      
        throw new Error('WebPageTest did not finish in time.');
      };
      

      
      const resultData = await waitForTestResults(newTestId);
      const formattedResults = formatWebPageTestResults(resultData);


      if (result.data.statusCode >= 400) {
        throw new Error(result.data.statusText);
      }

      // Ensure results are valid and return them
      //const formattedResults = formatWebPageTestResults(result.data.data);
      if (!formattedResults.performanceScore) {
        throw new Error('Invalid WebPageTest results: Missing performance score');
      }

      console.log(`Successfully fetched new test results for ${domain}`);
      return formattedResults;

    } catch (error) {
      console.error('Error running new test:', error.message);
      return {
        error: 'Failed to get WebPageTest data',
        details: error.response?.data || error.message
      };
    }
  }
};

function formatWebPageTestResults(data) {
  const median = data.median?.firstView || {};
  let lighthouseScore = median.lighthousePerformanceScore || 0;

  // If no lighthouse score or valid data, reject and return an error
  if (!lighthouseScore) {
    return {
      error: 'No valid performance data available from WebPageTest'
    };
  }

  return {
    performanceScore: lighthouseScore,
    firstContentfulPaint: median.firstContentfulPaint || 0,
    speedIndex: median.SpeedIndex || 0,
    timeToInteractive: median.fullyLoaded || 0,
    pageSize: (median.bytesIn / (1024 * 1024)).toFixed(2),
    pageRequests: median.requests || 0,
    screenshot: `https://www.webpagetest.org${median.images?.screenShot}`,
    source: 'WebPageTest'
  };
}

function calculatePerformanceScore(metrics = {}) {
  const weights = {
    firstContentfulPaint: 0.3,
    SpeedIndex: 0.25,
    fullyLoaded: 0.25,  // Changed to match the metric name
    bytesIn: 0.1,
    requests: 0.1
  };

  const normalized = {
    firstContentfulPaint: Math.min(100, Math.max(0, 100 - ((metrics.firstContentfulPaint || 3000) / 100))),
    SpeedIndex: Math.min(100, Math.max(0, 100 - ((metrics.SpeedIndex || 3000) / 100))),
    fullyLoaded: Math.min(100, Math.max(0, 100 - (Math.round(metrics.fullyLoaded || 5000) / 2000))),
    bytesIn: Math.min(100, Math.max(0, 100 - ((metrics.bytesIn || 102400) / (1024 * 100)))),
    requests: Math.min(100, Math.max(0, 100 - ((metrics.requests || 100) / 2)))
  };

  let score = 0;
  for (const [metric, weight] of Object.entries(weights)) {
    score += (normalized[metric] || 0) * weight;
  }

  return Math.round(score);
}

module.exports = { 
  getPageSpeed, 
  calculatePerformanceScore 
};
