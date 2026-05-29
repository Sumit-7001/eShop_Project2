const express = require('express');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to send token in JSON response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAuthToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error. Please try again later.'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password inputs
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.'
    });
  }

  try {
    // Check for user (must explicitly select password since it defaults to false)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error. Please try again later.'
    });
  }
});

/**
 * @route   POST /api/auth/google
 * @desc    Authenticate Google user
 * @access  Public
 */
router.post('/google', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      message: 'Google auth token (idToken) is required.'
    });
  }

  try {
    let payload;
    
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_oauth_client_id_here') {
      // Real verification with Google Cloud Identity Services API
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    } else {
      // Sandbox fallback token parsing (useful for development)
      console.warn("GOOGLE_CLIENT_ID is not configured in .env. Attempting fallback decoding.");
      try {
        const base64Url = idToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
        payload = JSON.parse(jsonPayload);
      } catch (err) {
        payload = {
          sub: '1234567890',
          email: 'google.user@eshop.com',
          name: 'Google User'
        };
      }
    }

    const { sub: googleId, email, name } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google login failed. Email address not provided by Google account.'
      });
    }

    // Check if user already exists in local DB
    let user = await User.findOne({ email });

    if (user) {
      // Connect Google ID if not already connected
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Register new user with Google identity SSO
      user = await User.create({
        name: name || 'Google User',
        email,
        googleId,
        role: 'user'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Google Auth Verification Error:', error);
    res.status(400).json({
      success: false,
      message: 'Google authentication verification failed. Token is invalid or expired.'
    });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Generate password reset token & simulate email notification
 * @access  Public
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user registered with this email address.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set it in the User Schema with 15-minute expiration
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save({ validateBeforeSave: false });

    // Build absolute password reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    // Under real-world usage, send email via Nodemailer. For sandbox, log to console and return url:
    console.log(`[PASSWORD RESET LINK]: ${resetUrl}`);

    res.status(200).json({
      success: true,
      message: 'A password reset token was generated. Verify email inbox (or backend logs).',
      // For sandbox verification simplicity, we return the resetToken so frontend can execute directly:
      resetToken
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not process request. Please try again.'
    });
  }
});

/**
 * @route   PUT /api/auth/reset-password/:resetToken
 * @desc    Reset password
 * @access  Public
 */
router.put('/reset-password/:resetToken', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a new password.'
    });
  }

  // Hash reset token to compare with DB value
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() } // Verify token is not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.'
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error resetting password.'
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user details
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch user details.'
    });
  }
});

module.exports = router;
