const db = require('../db'); // assuming mysql2/promise

exports.addSubscriber = async (req, res) => {
  const { full_name, email } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO newsletter_signups (full_name, email) VALUES (?, ?)',
      [full_name, email]
    );
    res.status(201).json({ message: 'Successfully subscribed!' });
  } catch (err) {
    console.error("❌ Database error:", err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This email is already subscribed.' });
    }

    res.status(500).json({ message: 'Database error' });
  }
};