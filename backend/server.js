const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

const app = express();

// ── DB Middleware (per-request connection for serverless) ─────────────────────
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    res.status(500).json({ success: false, message: 'Database connection failed.' });
  }
});

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://e-shop-project-six.vercel.app',
    'https://e-shop-project.vercel.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: '✅ eShop API is running!', status: 'ok' });
});

// ── Error Handling ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ── Start (local dev only) ───────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📧 SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
