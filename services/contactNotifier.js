// services/contactNotifier.js
// Emails Zuri whenever someone sends the website's contact form.
//
// Uses Resend's HTTP API (https://resend.com) rather than SMTP, because
// Railway blocks outbound SMTP on its Free/Hobby plans.
//
// Env vars:
//   RESEND_API_KEY        required to send; if missing, emails are skipped
//   CONTACT_NOTIFY_TO     who receives the alert (default info@clicstudio.io)
//   CONTACT_NOTIFY_FROM   sender; must be on a domain verified in Resend,
//                         e.g. "Clic Studio <hello@clicstudio.io>"
//                         (default Resend's test sender, which can only
//                         deliver to the email of the Resend account owner)
require("dotenv").config();
const axios = require("axios");

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function buildEmail({ name, email, phone, service, message }) {
  const subject = `New website inquiry from ${name}${service ? ` (${service})` : ""}`;

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Practice", service],
  ].filter(([, value]) => value);

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    message,
    "",
    "Reply to this email to answer them directly.",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#414141;line-height:1.6">
      <h2 style="color:#f46569;font-weight:600;margin:0 0 16px">New website inquiry</h2>
      <table style="border-collapse:collapse;margin-bottom:16px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#737373">${label}</td><td style="padding:4px 0"><b>${escapeHtml(value)}</b></td></tr>`
          )
          .join("")}
      </table>
      <div style="white-space:pre-wrap;background:#f7f2ee;border-radius:12px;padding:16px">${escapeHtml(message)}</div>
      <p style="color:#737373;font-size:13px;margin-top:16px">Reply to this email to answer them directly.</p>
    </div>`;

  return { subject, text, html };
}

async function notifyNewContact(contact) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️  RESEND_API_KEY not set, skipping contact email notification");
    return false;
  }

  const { subject, text, html } = buildEmail(contact);
  await axios.post(
    "https://api.resend.com/emails",
    {
      from: process.env.CONTACT_NOTIFY_FROM || "Clic Studio <onboarding@resend.dev>",
      to: [process.env.CONTACT_NOTIFY_TO || "info@clicstudio.io"],
      reply_to: contact.email,
      subject,
      text,
      html,
    },
    {
      timeout: 10000,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    }
  );
  console.log(`📧 Contact notification sent for message from ${contact.email}`);
  return true;
}

module.exports = { notifyNewContact, buildEmail };
