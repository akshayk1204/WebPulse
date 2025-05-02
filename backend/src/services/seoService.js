const axios = require('axios');
const cheerio = require('cheerio');

const getSEO = async (domain) => {
  try {
    const response = await axios.get(`https://${domain}`);
    const $ = cheerio.load(response.data);

    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || 'No description available';

    return {
      titleLength: title.length,
      metaDescription,
    };
  } catch (error) {
    console.error("❌ SEO fetch error:", error.message);
    throw new Error('Failed to fetch SEO data');
  }
};

module.exports = { getSEO };
