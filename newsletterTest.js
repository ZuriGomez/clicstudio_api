require("dotenv").config();
const axios = require("axios");

console.log("🟢 Starting newsletterTest.js");

// Load environment variables
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;

console.log("🔹 MAILERLITE_API_KEY:", MAILERLITE_API_KEY ? "✅ OK" : "❌ Missing");
console.log("🔹 MAILERLITE_GROUP_ID:", MAILERLITE_GROUP_ID ? "✅ OK" : "❌ Missing");

if (!MAILERLITE_API_KEY || !MAILERLITE_GROUP_ID) {
  console.error("❌ Missing MailerLite API key or group ID");
  process.exit(1);
}

// Test subscriber
const testSubscriber = {
  email: "test+newsletter@clicstudio.io",
  fields: {
    name: "Test User",
  },
  groups: [MAILERLITE_GROUP_ID], // keep it as string
};

// Function to add subscriber
async function addSubscriber() {
  try {
    console.log("🟢 Sending test subscriber to MailerLite...");

    const response = await axios.post(
      "https://connect.mailerlite.com/api/subscribers",
      testSubscriber,
      {
        headers: {
          Authorization: `Bearer ${MAILERLITE_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("✅ Success! Subscriber added:");
    console.log(response.data);
  } catch (err) {
    console.error("❌ MailerLite error:", err.response?.data || err.message);
  }
}

addSubscriber();