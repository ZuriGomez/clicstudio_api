// controllers/newsletterController.js
require("dotenv").config();
const axios = require("axios");

exports.addSubscriber = async (req, res) => {
  const { full_name, email } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address." });
  }

  try {
    const mailerLiteKey = process.env.MAILERLITE_API_KEY;
    const mailerLiteGroupId = process.env.MAILERLITE_GROUP_ID;

    // ✅ Send subscriber to MailerLite
    const mlResponse = await axios.post(
      "https://connect.mailerlite.com/api/subscribers",
      {
        email: email,
        fields: { name: full_name },
        groups: [mailerLiteGroupId], // <-- keep as string
        status: "active",
      },
      {
        headers: {
          Authorization: `Bearer ${mailerLiteKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("✅ Added to MailerLite:", mlResponse.data);

    // ✅ Return success response
    res.status(201).json({
      success: true,
      message: "Successfully subscribed to the newsletter!",
      subscriber: mlResponse.data,
    });
  } catch (error) {
    console.error("❌ MailerLite error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "There was an error subscribing to the newsletter.",
    });
  }
};