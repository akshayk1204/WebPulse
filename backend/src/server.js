const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { analyzeDomain } = require('./controllers/analysisController');


const app = express();
const PORT = 5050;

// CORS configuration to allow requests from React frontend
const corsOptions = {
  origin: 'http://localhost:3000', // Update this if your frontend is running on a different port
  methods: ['GET', 'POST'], // Allow only POST and GET methods
  allowedHeaders: ['Content-Type'], // Allow Content-Type header
};

app.use(cors(corsOptions));
app.use(express.json());

// Test route to confirm server is alive
app.get('/', (req, res) => {
  res.send('✅ Server is running!');
});

// Main analysis route (combines performance, security, and SEO)
app.post('/api/analyze', analyzeDomain);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
