// controllers/newsletterController.js
const db = require('../db'); // mysql2/promise connection pool
const TABLE_NAME = 'newsletter_signups';

exports.addSubscriber = async (req, res) => {
  const { full_name, email } = req.body;

  console.log('Request body:', req.body); // Log the incoming request body

  // Validate input
  if (!full_name || !email) {
    console.log('Validation failed: Missing fields');
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('Validation failed: Invalid email');
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  try {
    console.log('Inserting into database...');
    const [result] = await db.execute(
      `INSERT INTO ${TABLE_NAME} (full_name, email) VALUES (?, ?)`,
      [full_name, email]
    );

    console.log('Insert successful:', result);
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed!',
      subscriber: {
        id: result.insertId,
        full_name,
        email
      }
    });

  } catch (err) {
    console.error("❌ Database error:", err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This email is already subscribed.' });
    }

    res.status(500).json({ message: 'Database error' });
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    // Fetch all subscribers from the database
    const [rows] = await db.execute(
      `SELECT id, full_name, email, created_at FROM ${TABLE_NAME} ORDER BY created_at DESC`
    );

    // Respond with the list of subscribers
    res.status(200).json({
      success: true,
      subscribers: rows
    });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
};