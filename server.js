const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const newsletterRoutes = require('./routes/newsletter');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/newsletter', newsletterRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
