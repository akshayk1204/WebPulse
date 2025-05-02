const cheerio = require('cheerio');
const axios = require('axios');

const analyzeSEO = async (domain) => {
  try {
    const { data: html } = await axios.get(`https://${domain}`);
    const $ = cheerio.load(html);

    const permissionToIndex = !$('meta[name="robots"]').attr('content')?.includes('noindex');
    const metaDescription = !!$('meta[name="description"]').attr('content');
    const contentPlugins = !($('object, embed, applet').length > 0);
    const descriptiveLinkText = $('a').toArray().every(link => {
      const text = $(link).text().trim().toLowerCase();
      return text && !['click here', 'read more', 'more', 'link'].includes(text);
    });

    return {
      permissionToIndex,
      metaDescription,
      contentPlugins,
      descriptiveLinkText,
    };
  } catch (error) {
    console.error("❌ SEO analysis failed:", error.message);
    return {
      permissionToIndex: false,
      metaDescription: false,
      contentPlugins: false,
      descriptiveLinkText: false,
    };
  }
};

module.exports = { analyzeSEO };
