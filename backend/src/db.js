// backend/src/db.js
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

console.log('PG config:', {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// PostgreSQL connection config
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT || 5432,
  });
  
// Generate a new UUID for each report
const generateGUID = () => uuidv4();

// Insert report data
const insertReport = async ({
  domain,
  language = 'en',
  scores,
  performanceData,
  seoData,
  mobileData,
  securityData,
}) => {
  const guid = generateGUID();

  const query = `
    INSERT INTO reports (
      guid, domain, language, scores,
      performance_data, seo_data, mobile_data, security_data
    ) VALUES (
      $1, $2, $3, $4::jsonb,
      $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb
    )
    RETURNING guid
  `;

  const values = [
    guid,
    domain,
    language,
    JSON.stringify(scores),
    JSON.stringify(performanceData),
    JSON.stringify(seoData),
    JSON.stringify(mobileData),
    JSON.stringify(securityData),
  ];

  const result = await pool.query(query, values);
  return result.rows[0].guid;
};

// Retrieve report by GUID
const getReportByGuid = async (guid) => {
  const query = 'SELECT * FROM reports WHERE guid = $1';
  const result = await pool.query(query, [guid]);
  return result.rows[0] || null;
};

module.exports = {
  insertReport,
  getReportByGuid,
};
