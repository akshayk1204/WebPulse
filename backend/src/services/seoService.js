const cheerio = require('cheerio');
const axios = require('axios');

const analyzeSEO = async (url) => {
  try {
    const { data, headers } = await axios.get(`https://${url}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    
    const $ = cheerio.load(data);
    
    // Basic checks
    const indexable = isPageIndexable($);
    const hasMetaDesc = hasMetaDescription($);
    const cleanContent = checkContentPlugins($);
    const descriptiveLinks = checkDescriptiveLinks($);

    return {
      indexable,
      hasMetaDescription: hasMetaDesc,
      usesCleanContent: cleanContent,
      hasDescriptiveLinks: descriptiveLinks,
      title: {
        text: $('title').text().trim(),
        length: $('title').text().trim().length,
        optimal: $('title').text().trim().length >= 30 && $('title').text().trim().length <= 60
      },
      headings: {
        h1: $('h1').length,
        h2: $('h2').length,
        h3: $('h3').length,
        validStructure: $('h1').length === 1
      },
      images: {
        withAlt: $('img[alt]').length,
        withoutAlt: $('img:not([alt])').length
      },
      canonical: $('link[rel="canonical"]').attr('href'),
      schemaMarkup: $('script[type="application/ld+json"]').length > 0,
      httpStatus: headers['content-type']?.includes('text/html') ? 200 : 406
    };
    
  } catch (error) {
    console.error('SEO analysis error:', error.message);
    return {
      error: 'SEO analysis failed',
      details: error.message,
      statusCode: error.response?.status || 500
    };
  }
};

// Helper functions remain the same
const isPageIndexable = ($) => {
  const robotsMeta = $('meta[name="robots"]').attr('content') || '';
  return !robotsMeta.includes('noindex') && !robotsMeta.includes('none');
};

const hasMetaDescription = ($) => {
  const desc = $('meta[name="description"]').attr('content') || '';
  return desc.length >= 50 && desc.length <= 160;
};

const checkContentPlugins = ($) => {
  const scripts = $('script[src]').map((_, el) => $(el).attr('src')).get();
  const badPlugins = ['flash', 'silverlight', 'java-applet', 'shockwave'];
  return !scripts.some(src => badPlugins.some(plugin => src.includes(plugin)));
};

const checkDescriptiveLinks = ($) => {
  const badPhrases = ['click here', 'read more', 'link'];
  return $('a').toArray().every(el => {
    const text = $(el).text().trim().toLowerCase();
    return text.length > 5 && !badPhrases.some(phrase => text.includes(phrase));
  });
};

module.exports = { analyzeSEO };