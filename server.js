// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const newsletterRoutes = require("./routes/newsletter");
const contactRoutes = require("./routes/contact");

dotenv.config();
const app = express();

// ✅ Whitelist origins
const allowedOrigins = [
  process.env.CORS_ORIGIN_DEV,
  process.env.CORS_ORIGIN_PROD,
  "https://clicstudio.io",
  "http://clicstudio.io",
  "https://www.clicstudio.io",
  "http://www.clicstudio.io",
].filter(Boolean);

// ✅ CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true, // if you ever need cookies/auth headers
}));

// ✅ Explicit preflight handling (not strictly needed, but safe)
app.options("*", cors());

// ✅ Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// ✅ Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// ✅ Routes
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));