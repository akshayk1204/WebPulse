const axios = require('axios');
const cheerio = require('cheerio');

const analyzeMobileMetrics = async (url) => {
  try {
    const response = await axios.get(`https://${url}`, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
      }
    });

    const $ = cheerio.load(response.data);
    
    return {
      responsive: checkResponsiveDesign($),
      viewportMeta: $('meta[name="viewport"]').length > 0,
      tapTargets: checkTapTargets($),
      screenshot: `https://s0.wp.com/mshots/v1/${url}?w=400`,
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    console.error('Mobile analysis error:', error.message);
    return {
      responsive: false,
      viewportMeta: false,
      tapTargets: false,
      error: error.message,
      lastChecked: new Date().toISOString()
    };
  }
};

const checkResponsiveDesign = ($) => {
  try {
    const hasViewportMeta = $('meta[name="viewport"]').length > 0;
    const usesResponsiveCSS = $('link[rel="stylesheet"][media*="screen"]').length > 0;
    const usesMediaQueries = $('style').text().includes('@media') || 
                           $('link[rel="stylesheet"]').attr('href')?.includes('@media');
    return hasViewportMeta || usesResponsiveCSS || usesMediaQueries;
  } catch (e) {
    return false;
  }
};

const checkTapTargets = ($) => {
  try {
    const buttons = $('button, input[type="button"], input[type="submit"], a[role="button"]');
    let allValid = true;

    buttons.each((i, el) => {
      const $el = $(el);
      const fontSize = parseInt($el.css('font-size')) || 16;
      const padding = parseInt($el.css('padding')) || 0;
      const minSize = 48;

      if ((fontSize + padding * 2) < minSize) {
        allValid = false;
        return false;
      }
    });

    return allValid;
  } catch (e) {
    return false;
  }
};

module.exports = { analyzeMobileMetrics };