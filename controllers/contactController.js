const db = require('../db');

exports.addMessage = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message]
    );
    res.status(201).json({ message: 'Message received!', id: result.insertId });

  } catch (err) {
    console.error("❌ Database error:", err);

    // Check for duplicate key error
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This email is already registered.' });
    }

    res.status(500).json({ message: 'Database error', error: err.message });
  }
};