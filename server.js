// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const newsletterRoutes = require("./routes/newsletter");
const contactRoutes = require("./routes/contact");

dotenv.config();
const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN_DEV,
  process.env.CORS_ORIGIN_PROD,
  "https://clicstudio.io",
  "http://clicstudio.io",
  "https://www.clicstudio.io",
  "http://www.clicstudio.io",
].filter(Boolean);

app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin); // Debugging log
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS error: Origin ${origin} not allowed`);
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.options("*", cors({ origin: allowedOrigins })); // Handle preflight requests

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Health check (useful for Railway)
app.get("/health", (_req, res) => res.json({ ok: true }));

// Routes
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
