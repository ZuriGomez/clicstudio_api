const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const newsletterRoutes = require('./routes/newsletter');

dotenv.config();
const app = express();

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow requests like curl/postman with no origin
    const allowedOrigins = ['http://localhost:5174', 'https://clicstudio.io'];
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  }
}));


app.use(express.json());

app.use('/api/newsletter', newsletterRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
