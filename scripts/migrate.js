// scripts/migrate.js
require('dotenv').config();
const db = require('../db');

async function run() {
  try {
    // Create newsletter_signups
    await db.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_signups (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uniq_email (email)
      )
    `);

    // Create contact_messages
    await db.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )
    `);

    console.log('✅ Tables ensured/created');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

run();