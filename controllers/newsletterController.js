const db = require('../db'); // mysql2/promise connection pool

exports.addSubscriber = async (req, res) => {
  const { full_name, email } = req.body;

  // Validate input
  if (!full_name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  try {
    // Insert subscriber into the database
    const [result] = await db.execute(
      'INSERT INTO newsletter_signups (full_name, email) VALUES (?, ?)',
      [full_name, email]
    );

    // Return success with inserted ID (optional)
    res.status(201).json({
      message: 'Successfully subscribed!',
      subscriberId: result.insertId
    });

  } catch (err) {
    console.error("❌ Database error:", err);

    // Handle duplicate email
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This email is already subscribed.' });
    }

    // Handle other database errors
    res.status(500).json({ message: 'Database error' });
  }
};