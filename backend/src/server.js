const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const { analyzeDomain } = require('./controllers/analysisController');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
require('./db');
const { getReportByGuid } = require('./db');

const app = express();
const PORT = process.env.PORT || 5050;
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy for rate limiting behind Nginx
app.set('trust proxy', 1);

// ======================
// Security Middleware
// ======================
app.use(helmet({
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  } : false
}));

app.use(compression());

// ======================
// Request Parsing
// ======================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ======================
// Static Assets
// ======================
app.use('/assets', express.static(path.join(__dirname, 'public/assets'), {
  maxAge: '1y',
  immutable: true
}));

// Serve React build files in production
if (isProduction) {
  app.use(express.static(path.join(__dirname, '../frontend/build'), {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));
}

// ======================
// CORS Configuration
// ======================
const allowedOrigins = isProduction 
  ? ['https://webpulse.letsdemo.co']
  : ['http://localhost:3000', 'https://webpulse.letsdemo.co'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ======================
// Rate Limiting
// ======================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 100 : 1000,
  message: 'Too many requests, please try again later'
});

// ======================
// Logging
// ======================
app.use(morgan(isProduction ? 'combined' : 'dev'));

// ======================
// API Routes
// ======================

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// GUID validation middleware
const validateGuid = (req, res, next) => {
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!guidRegex.test(req.params.guid)) {
    return res.status(400).json({ error: 'Invalid report ID format' });
  }
  next();
};

// Report API endpoint
app.get('/api/report/:guid', validateGuid, async (req, res) => {
  try {
    const report = await getReportByGuid(req.params.guid);
    if (!report) {
      return res.status(404).json({ 
        error: 'Report not found',
        guid: req.params.guid,
        suggestion: 'This report may have expired or was deleted'
      });
    }
    res.setHeader('Content-Type', 'application/json');
    res.json(report);
  } catch (err) {
    console.error('Failed to fetch report:', err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Analysis endpoint
app.post('/api/analyze', apiLimiter, async (req, res) => {
  try {
    console.log('Analysis request received for domain:', req.body.domain); // Add logging
    await analyzeDomain(req, res);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      details: error.message, // Include error details
      timestamp: new Date().toISOString()
    });
  }
});

// ======================
// Client-Side Routing
// ======================

// Backwards compatibility redirect
app.get('/report/:guid', validateGuid, (req, res) => {
  res.redirect(301, `/share/${req.params.guid}`);
});

// Share route handler
app.get('/share/:guid', validateGuid, (req, res) => {
  if (isProduction) {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  } else {
    res.redirect(`http://localhost:3000/share/${req.params.guid}`);
  }
});

// Catch-all route for client-side routing
if (isProduction) {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.includes('.')) {
      res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    } else {
      res.status(404).end();
    }
  });
}

// ======================
// Error Handling
// ======================
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// ======================
// Server Startup
// ======================
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

module.exports = server;