// db/index.js
const mysql = require('mysql2/promise');
require('dotenv').config();

function configFromUrl(url) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace('/', ''),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // multipleStatements: false, // keep false for safety; we’ll run statements separately
  };
}

const cfg = process.env.MYSQL_URL
  ? configFromUrl(process.env.MYSQL_URL)
  : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'clicstudio',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // multipleStatements: false
    };

const pool = mysql.createPool(cfg);

// Optional: quick ping on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ MySQL pool connected');
  } catch (e) {
    console.error('❌ MySQL connection failed:', e.message);
  }
})();

module.exports = pool;