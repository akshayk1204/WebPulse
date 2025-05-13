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
dotenv.config();
require('./db');
const { getReportByGuid } = require('./db');

const app = express();
const PORT = process.env.PORT || 5050;
const isProduction = process.env.NODE_ENV === 'production';

// ======================
// Middleware Configuration
// ======================
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ======================
// Static Assets
// ======================
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

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
  optionsSuccessStatus: 200,
  credentials: true
}));

// ======================
// Rate Limiting
// ======================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 100 : 1000,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
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

// Strict GUID validation middleware
const validateGuid = (req, res, next) => {
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!guidRegex.test(req.params.guid)) {
    return res.status(400).json({ error: 'Invalid report ID format' });
  }
  next();
};

// Report API with separate validation
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
    res.json(report);
  } catch (err) {
    console.error('Failed to fetch report:', err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Analysis Endpoint
app.post('/analyze', apiLimiter, async (req, res) => {
  try {
    await analyzeDomain(req, res);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      timestamp: new Date().toISOString()
    });
  }
});

// ======================
// Client-Side Routing (Production Only)
// ======================
if (isProduction) {
  // Serve React build files
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Handle client-side routing - must be last
  app.get('*', (req, res) => {
    // Skip API routes and static files
    if (req.path.startsWith('/api') || req.path.includes('.')) {
      return res.status(404).end();
    }
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
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

// ======================
// Process Management
// ======================
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

module.exports = server;