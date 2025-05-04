// backend/src/utils/apiUtils.js
const { RateLimiter } = require('limiter');

// Configure rate limiting (1 request per second)
const limiter = new RateLimiter({
  tokensPerInterval: 1,
  interval: 1000
});

/**
 * Wraps API calls with rate limiting
 */
const throttledApiCall = async (apiFunction) => {
  await limiter.removeTokens(1);
  return apiFunction();
};

module.exports = { throttledApiCall };