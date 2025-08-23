const db = require('../db');

exports.addMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Basic input validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Optional: sanitize inputs (trim)
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim();
    const sanitizedPhone = phone.trim();
    const sanitizedMessage = message.trim();

    // Insert into database
    const [result] = await db.execute(
      `INSERT INTO contact_messages (name, email, phone, message)
       VALUES (?, ?, ?, ?)`,
      [sanitizedName, sanitizedEmail, sanitizedPhone, sanitizedMessage]
    );

    // Respond with success
    return res.status(201).json({
      message: 'Message received!',
      id: result.insertId
    });

  } catch (err) {
    // Log full error to console for debugging
    console.error('❌ ContactController addMessage error:', err);

    // Handle duplicate entry (if you ever add unique constraint)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This email is already registered.' });
    }

    // Catch all other errors safely
    return res.status(500).json({
      message: 'Internal server error while saving the message.',
      error: err.message
    });
  }
};

// Optional: GET all messages for testing
exports.getMessages = async (_req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, phone, message, created_at FROM contact_messages ORDER BY created_at DESC'
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ ContactController getMessages error:', err);
    res.status(500).json({
      message: 'Internal server error while fetching messages.',
      error: err.message
    });
  }
};