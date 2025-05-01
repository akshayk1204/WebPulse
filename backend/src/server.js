const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const sslChecker = require('ssl-checker');
require('dotenv').config();

const app = express();
const PORT = 5050;

// CORS configuration to allow requests from React frontend
const corsOptions = {
  origin: 'http://localhost:3000',  // Update this if your frontend is running on a different port
  methods: ['GET', 'POST'],  // Allow only POST and GET methods
  allowedHeaders: ['Content-Type'],  // Allow Content-Type header
};

app.use(cors(corsOptions));
app.use(express.json());

// Test route to confirm server is alive
app.get('/', (req, res) => {
  res.send('✅ Server is running!');
});

// Route to fetch Google PageSpeed Insights
const getPageSpeed = async (domain) => {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://${domain}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    return {
      performanceScore: data.lighthouseResult.categories.performance.score,
      firstContentfulPaint: data.lighthouseResult.audits['first-contentful-paint'].displayValue,
      speedIndex: data.lighthouseResult.audits['speed-index'].displayValue,
      timeToInteractive: data.lighthouseResult.audits['interactive'].displayValue,
    };
  } catch (error) {
    console.error("❌ PageSpeed fetch error:", error.message);
    if (error.response) {
      console.error("🔍 Response data:", error.response.data);
      console.error("🔍 Status:", error.response.status);
    }
    throw new Error('Failed to fetch PageSpeed data');
  }
};


// Route to check SSL and security headers
const getSecurity = async (domain) => {
  try {
    const sslResult = await sslChecker(domain);
    const headers = await axios.get(`https://${domain}`);
    const securityHeaders = headers.data.includes('Strict-Transport-Security') ? 'Enabled' : 'Not Enabled';

    return {
      sslStatus: sslResult.isValid ? 'Valid' : 'Invalid',
      https: sslResult.isSecure,
      securityHeaders,
    };
  } catch (error) {
    throw new Error('Failed to fetch security data');
  }
};

// Route to fetch SEO info like title and meta description
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
    throw new Error('Failed to fetch SEO data');
  }
};

// Main analysis route (combines performance, security, and SEO)
app.post('/api/analyze', async (req, res) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  // ✅ Sanitize domain input
  const sanitizedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

  try {
    // Get PageSpeed data
    const pagespeedData = await getPageSpeed(sanitizedDomain);

    // Get Security data
    const securityData = await getSecurity(sanitizedDomain);

    // Get SEO data
    const seoData = await getSEO(sanitizedDomain);

    return res.json({
      performance: pagespeedData,
      seo: seoData,
      security: securityData,
    });
  } catch (error) {
    console.error('Error during full analysis:', error.message);
    return res.status(500).json({ error: 'Failed to fetch full analysis data' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
