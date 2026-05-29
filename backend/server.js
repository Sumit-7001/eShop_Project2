const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parser
app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);

// ── SMTP Connection Test Endpoint (Development) ───────────────────────────────
app.get('/api/test-email', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Verify SMTP connection first
    await transporter.verify();
    console.log('✅ [SMTP] Connection verified!');

    // Send real test email to self
    const info = await transporter.sendMail({
      from: `"eShop Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: '✅ eShop SMTP Test - Email Working!',
      html: `<h2>🎉 Gmail SMTP is working!</h2><p>Your eShop email system is correctly configured.</p><p>Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>`
    });

    console.log('✅ [SMTP] Test email sent! ID:', info.messageId);
    res.json({ success: true, message: 'Test email sent! Check your inbox.', messageId: info.messageId });
  } catch (error) {
    console.error('❌ [SMTP ERROR]:', error.message);
    res.status(500).json({ success: false, error: error.message, code: error.code });
  }
});

// Base test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'eShop eCommerce Auth API is running smoothly!' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error. Please contact admin.'
  });
});

// Route not found fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📧 SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT} | User: ${process.env.SMTP_USER}`);
});
