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
  "http://localhost:5173",
  process.env.CORS_ORIGIN_DEV,
  process.env.CORS_ORIGIN_PROD,
  "https://clicstudio.io",
  "http://clicstudio.io",
  "https://www.clicstudio.io",
  "http://www.clicstudio.io",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    console.log("🔹 Incoming origin:", origin); // <--- log for debugging
    // allow requests with no origin or from localhost / your production domains
    if (!origin || origin.startsWith("http://localhost") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
};

// ✅ Use cors globally
app.use(cors(corsOptions));

// ✅ Handle preflight explicitly
app.options("*", cors(corsOptions));

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