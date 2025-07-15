const db = require('../db');

exports.addSubscriber = async (req, res) => {
  const { full_name, phone, email, consent } = req.body;

  if (!full_name || !email) {
    return res
      .status(400)
      .json({ message: 'Full name and email are required.' });
  }

  try {
    const sql = `
      INSERT INTO newsletter_signups (full_name, phone, email, consent)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await db.query(sql, [
      full_name,
      phone,
      email,
      consent ? true : false,
    ]);

    res.status(201).json({ message: 'Successfully subscribed!' });
  } catch (err) {
    if (err.code === '23505') {
      // 23505 = unique_violation in PostgreSQL
      return res
        .status(409)
        .json({ message: 'This email is already subscribed.' });
    }

    console.error(err);
    res.status(500).json({ message: 'Database error', error: err });
  }
};
