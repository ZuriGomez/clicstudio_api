const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const newsletterRoutes = require('./routes/newsletter');

dotenv.config();
const app = express();

// ✅ CORS setup to allow both local + live frontend
const allowedOrigins = ['http://localhost:5173', 'https://clicstudio.io'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use('/api/newsletter', newsletterRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
