const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // Ensures .env in parent dir is loaded

const dbConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10) || 5432,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false
};

const pool = new Pool(dbConfig);

// Connection event handlers
pool.on('connect', () => {
  console.log('Database connection established');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err.message);
});

// Test connection on startup
(async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection test successful');
    client.release();
  } catch (err) {
    console.error('Database connection test failed:', err.message);
    process.exit(1);
  }
})();

const generateGUID = () => uuidv4();

const insertReport = async (reportData) => {
  const client = await pool.connect();
  try {
    console.log(`Inserting report for domain: ${reportData.domain}`);
    
    const result = await client.query(`
      INSERT INTO reports (
        guid, domain, language, scores,
        performance_data, seo_data, mobile_data, security_data
      ) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb)
      RETURNING guid
    `, [
      reportData.guid,
      reportData.domain,
      reportData.language,
      JSON.stringify(reportData.scores),
      JSON.stringify(reportData.performanceData || {}),
      JSON.stringify(reportData.seoData || {}),
      JSON.stringify(reportData.mobileData || {}),
      JSON.stringify(reportData.securityData || {})
    ]);

    console.log(`Report inserted with GUID: ${result.rows[0].guid}`);
    return result.rows[0].guid;
  } finally {
    client.release();
  }
};

const getReportByGuid = async (guid) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM reports WHERE guid = $1', 
      [guid]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

module.exports = {
  insertReport,
  getReportByGuid,
  pool
};
