const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contact');

dotenv.config();
const app = express();

// CORS setup
app.use(cors({
  origin: process.env.CORS_ORIGIN
}));

app.use(express.json());

// Routes
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));