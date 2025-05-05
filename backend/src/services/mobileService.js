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
    const html = response.data;
    
    return {
      responsive: checkResponsiveDesign($),
      viewportMeta: $('meta[name="viewport"]').length > 0,
      tapTargets: checkTapTargets($),
      mobileSpeed: await checkMobileSpeed(html), // New metric
      fontSizes: checkFontSizes($),             // New metric
      contentFitting: checkContentFitting($),   // New metric
      screenshot: `https://s0.wp.com/mshots/v1/${url}?w=400`,
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    console.error('Mobile analysis error:', error.message);
    return {
      responsive: false,
      viewportMeta: false,
      tapTargets: false,
      mobileSpeed: false,
      fontSizes: false,
      contentFitting: false,
      error: error.message,
      lastChecked: new Date().toISOString()
    };
  }
};

// Existing checks
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

// New metric checks
const checkMobileSpeed = async (html) => {
  try {
    // Simple heuristic: check if page is reasonably small
    const maxSize = 500000; // 500KB
    return html.length < maxSize;
  } catch (e) {
    return false;
  }
};

const checkFontSizes = ($) => {
  try {
    const bodyFontSize = parseInt($('body').css('font-size')) || 16;
    return bodyFontSize >= 14; // Minimum recommended font size
  } catch (e) {
    return false;
  }
};

const checkContentFitting = ($) => {
  try {
    // Check if any elements have horizontal scrolling
    const hasHorizontalScroll = $('*').filter((i, el) => {
      return el.scrollWidth > el.clientWidth;
    }).length > 0;
    
    return !hasHorizontalScroll;
  } catch (e) {
    return false;
  }
};

module.exports = { analyzeMobileMetrics };