const mysql = require("mysql2/promise");
require("dotenv").config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("✅ Connected to MySQL!");

  // Create newsletter_signups table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_signups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("🎉 newsletter_signups table ready!");

  // Create contact_messages table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) DEFAULT NULL,
      service VARCHAR(100) DEFAULT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("🎉 contact_messages table ready!");

  // Add service column to existing tables (safe to re-run)
  try {
    await connection.execute(`
      ALTER TABLE contact_messages ADD COLUMN service VARCHAR(100) DEFAULT NULL AFTER phone
    `);
    console.log("✅ service column added to contact_messages");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("ℹ️  service column already exists, skipping");
    } else {
      throw err;
    }
  }

  // Make phone nullable on existing tables (safe to re-run)
  await connection.execute(`
    ALTER TABLE contact_messages MODIFY COLUMN phone VARCHAR(20) DEFAULT NULL
  `);
  console.log("✅ phone column updated to nullable");

  await connection.end();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
});