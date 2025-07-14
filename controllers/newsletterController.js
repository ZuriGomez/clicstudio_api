const db = require('../db');

exports.addSubscriber = (req, res) => {
  const { full_name, phone, email, consent } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ message: "Full name and email are required." });
  }

  const sql = `
    INSERT INTO newsletter_signups (full_name, phone, email, consent)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [full_name, phone, email, consent ? 1 : 0], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'This email is already subscribed.' });
      }
      return res.status(500).json({ message: 'Database error', error: err });
    }

    res.status(201).json({ message: 'Successfully subscribed!' });
  });
};
