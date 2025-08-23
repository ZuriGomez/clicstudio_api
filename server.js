// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contact');

dotenv.config();
const app = express();

const allowedOrigins = [process.env.CORS_ORIGIN_DEV, process.env.CORS_ORIGIN_PROD].filter(Boolean);
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

// Health check (useful for Railway)
app.get('/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));