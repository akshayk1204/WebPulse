const axios = require('axios');
require('dotenv').config();

const WPT_API_KEY = process.env.WEBPAGETEST_API_KEY;
const WPT_TEST_URL = 'https://www.webpagetest.org/runtest.php';
const WPT_RESULT_URL = 'https://www.webpagetest.org/jsonResult.php';
/*
const getPageSpeed = async (domain) => {
  if (!WPT_API_KEY) throw new Error('WebPageTest API key missing');
  
  try {
    console.log(`Starting test for domain: ${domain}`);
    const { data: testData } = await axios.get(WPT_TEST_URL, {
      params: {
        url: `https://${domain}`,
        f: 'json',
        location: 'Dulles:Chrome',
        runs: 1,
        mobile: 0,
        lighthouse: 1
      },
      headers: {
        'X-WPT-API-KEY': WPT_API_KEY
      },
      timeout: 15000 // Increased to 15 seconds
    });

    if (testData.statusCode >= 400) {
      throw new Error(testData.statusText);
    }

    if (testData.data.statusCode === 101) {
      const initialQueuePosition = testData.data.behindCount;
      console.log(`Test queued. Initial position: ${initialQueuePosition}`);
      await waitUntilTestStarts(testData.data.testId, initialQueuePosition);
    }

    const result = await pollForResults(testData.data.testId);
    console.log('Test completed successfully');
    return formatWebPageTestResults(result);
    
  } catch (error) {
    console.error('WebPageTest error:', error.message);
    if (axios.isAxiosError(error)) {
      console.error('Axios details:', {
        code: error.code,
        config: error.config,
        response: error.response?.data
      });
    }
    return {
      error: 'Failed to get WebPageTest data',
      details: error.response?.data || error.message,
      suggestion: 'Please try again in a few minutes'
    };
  }
};
*/

const getPageSpeed = async (domain) => {
    console.log(`Skipping real performance test for domain: ${domain}`);
  
    // Return placeholder values for UI development
    return {
      performanceScore: 58,
      firstContentfulPaint: 2.1,     // seconds
      speedIndex: 3.4,               // seconds
      timeToInteractive: 5.0,        // seconds
      pageSize: '2.3',               // MB
      pageRequests: 79,
      screenshot: 'https://www.webpagetest.org/result/200502_XY/1_performance.png',  // Placeholder or actual screenshot URL
      source: 'default'
    };
  };

async function waitUntilTestStarts(testId, initialQueuePosition) {
  let queuePosition = initialQueuePosition;
  let attempts = 0;
  const maxAttempts = 60; // Max 5 minutes
  
  while (attempts < maxAttempts) {
    attempts++;
    try {
      const { data } = await axios.get(WPT_RESULT_URL, {
        params: { test: testId, f: 'json' },
        timeout: 10000
      });

      if (data.statusCode === 100 || data.statusCode === 200) {
        console.log('Test is now running');
        return;
      }

      if (data.statusCode === 101) {
        queuePosition = data.data.behindCount;
        const waitTime = calculateWaitTime(queuePosition, attempts);
        console.log(`Queue position: ${queuePosition}. Waiting ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        throw new Error(data.statusText || 'Unexpected test status');
      }
    } catch (error) {
      console.error(`Queue check error (attempt ${attempts}):`, error.message);
      const waitTime = Math.min(10000 + (attempts * 1000), 30000);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw new Error('Timeout waiting for test to start');
}

function calculateWaitTime(queuePosition, attempts) {
  const baseWait = 5000;
  const positionFactor = Math.min(queuePosition * 500, 20000);
  const attemptFactor = Math.min(attempts * 1000, 20000);
  return baseWait + positionFactor + attemptFactor;
}

async function pollForResults(testId) {
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max
  
  while (attempts < maxAttempts) {
    attempts++;
    try {
      const { data } = await axios.get(WPT_RESULT_URL, {
        params: { test: testId, f: 'json' },
        timeout: 15000
      });

      if (data.statusCode === 200) return data.data;
      if (data.statusCode === 100) {
        const waitTime = Math.min(5000 + (attempts * 1000), 30000);
        console.log(`Test running (attempt ${attempts}). Waiting ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw new Error(data.statusText || 'Unexpected test status');
    } catch (error) {
      console.error(`Polling error (attempt ${attempts}):`, error.message);
      const waitTime = Math.min(10000 + (attempts * 1000), 30000);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw new Error(`Test did not complete within ${maxAttempts * 5} seconds`);
}


module.exports = { getPageSpeed };

function formatWebPageTestResults(data) {
  const median = data.median.firstView;
  return {
    performanceScore: calculatePerformanceScore(median),
    firstContentfulPaint: median.firstContentfulPaint / 1000,
    speedIndex: median.SpeedIndex / 1000,
    timeToInteractive: median.fullyLoaded / 1000,
    pageSize: (median.bytesIn / (1024 * 1024)).toFixed(2),
    pageRequests: median.requests,
    screenshot: `https://www.webpagetest.org${median.images.screenShot}`,
    source: 'WebPageTest'
  };
}

function calculatePerformanceScore(metrics) {
  // Custom scoring algorithm based on WebPageTest metrics
  const scores = {
    fcp: Math.max(0, 100 - (metrics.firstContentfulPaint / 2000)), // 2s = 100, 4s = 50
    speedIndex: Math.max(0, 100 - (metrics.SpeedIndex / 3000)), // 3s = 100, 6s = 50
    requests: Math.max(0, 100 - (metrics.requests / 2)), // 50 requests = 100, 100 = 50
    bytes: Math.max(0, 100 - (metrics.bytesIn / (1024 * 50))) // 50KB = 100, 100KB = 50
  };
  
  return Math.round(
    (scores.fcp * 0.4) +
    (scores.speedIndex * 0.3) +
    (scores.requests * 0.15) +
    (scores.bytes * 0.15)
  );
}

module.exports = { getPageSpeed };