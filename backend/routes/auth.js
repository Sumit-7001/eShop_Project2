const express = require('express');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const {
  sendWelcomeEmail,
  sendVerificationOTPEmail,
  sendForgotPasswordOTPEmail,
  sendLoginAlertEmail,
  sendOrderConfirmationEmail
} = require('../utils/emailService');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 6-digit OTP code generator
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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
 * @desc    Register a new user (Unverified, triggers OTP mail)
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

    // Generate 6-digit verification OTP
    const otp = generateOTP();
    const otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Create unverified user
    user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      otpCode: otp,
      otpExpire,
      otpType: 'verification',
      otpAttempts: 0
    });

    // Send Welcome Email and Verification OTP Email asynchronously
    await sendWelcomeEmail(user.name, user.email).catch(console.error);
    await sendVerificationOTPEmail(user.name, user.email, otp).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Registration successful! A 6-digit security code has been sent to your email address.',
      email: user.email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error. Please try again later.'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user, check verification state, issue token, send Login Alert
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

    // Check if email is verified
    if (!user.isVerified) {
      // Generate a new 6-digit OTP code
      const otp = generateOTP();
      user.otpCode = otp;
      user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 mins
      user.otpType = 'verification';
      user.otpAttempts = 0;
      await user.save({ validateBeforeSave: false });

      // Send Verification OTP Email
      await sendVerificationOTPEmail(user.name, user.email, otp).catch(console.error);

      return res.status(200).json({
        success: false,
        isVerified: false,
        message: 'Please verify your email address to activate your account. A 6-digit security code has been sent to your email address.',
        email: user.email
      });
    }

    // Send Login Alert email asynchronously
    await sendLoginAlertEmail(user, req).catch(console.error);

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error. Please try again later.'
    });
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify 6-digit OTP (for email verification or password reset authorization)
 * @access  Public
 */
router.post('/verify-otp', async (req, res) => {
  const { email, otp, type } = req.body;

  if (!email || !otp || !type) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email, OTP code, and verification type.'
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user registered with this email address.'
      });
    }

    // Check brute-force attempts lockout (max 5 failed attempts)
    if (user.otpAttempts >= 5) {
      return res.status(400).json({
        success: false,
        message: 'Too many failed verification attempts. This security code is locked. Please request a new code.'
      });
    }

    // Validate OTP matches, is correct type, and is not expired
    const isMatch = user.otpCode === otp;
    const isCorrectType = user.otpType === type;
    const isNotExpired = user.otpExpire && Date.now() < user.otpExpire;

    if (!isMatch || !isCorrectType || !isNotExpired) {
      // Increment failed attempts
      user.otpAttempts += 1;
      await user.save({ validateBeforeSave: false });

      let failMsg = 'Invalid security verification code.';
      if (isMatch && isCorrectType && !isNotExpired) {
        failMsg = 'The security verification code has expired (valid for 5 mins).';
      }
      
      const attemptsRemaining = Math.max(0, 5 - user.otpAttempts);
      const remainingMsg = attemptsRemaining > 0 
        ? ` You have ${attemptsRemaining} attempts remaining before this code gets locked.`
        : ' This security code is now locked. Please generate a new code.';

      return res.status(400).json({
        success: false,
        message: failMsg + remainingMsg
      });
    }

    // Reset OTP fields on successful verification
    user.otpCode = undefined;
    user.otpExpire = undefined;
    user.otpType = undefined;
    user.otpAttempts = 0;

    if (type === 'verification') {
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });

      // Automatically log them in on successful email verification
      sendTokenResponse(user, 200, res);
    } else if (type === 'forgot') {
      // Generate secure temporary reset token
      const resetToken = crypto.randomBytes(20).toString('hex');
      
      // Hash reset token and store in database with 15-minute expiration
      user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully. You can now reset your password.',
        resetToken
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error verifying OTP code.'
    });
  }
});

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Regenerate and resend 6-digit OTP
 * @access  Public
 */
router.post('/resend-otp', async (req, res) => {
  const { email, type } = req.body;

  if (!email || !type) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and verification type.'
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user registered with this email address.'
      });
    }

    // Generate a new 6-digit OTP
    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 mins
    user.otpType = type;
    user.otpAttempts = 0;

    await user.save({ validateBeforeSave: false });

    // Send corresponding email
    if (type === 'verification') {
      await sendVerificationOTPEmail(user.name, user.email, otp).catch(console.error);
    } else if (type === 'forgot') {
      await sendForgotPasswordOTPEmail(user.name, user.email, otp).catch(console.error);
    }

    res.status(200).json({
      success: true,
      message: 'A new 6-digit security code has been sent successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error regenerating security code.'
    });
  }
});

/**
 * @route   POST /api/auth/google
 * @desc    Authenticate Google user (Auto-verifies profile)
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
      let isModified = false;
      if (!user.googleId) {
        user.googleId = googleId;
        isModified = true;
      }
      if (!user.isVerified) {
        user.isVerified = true;
        isModified = true;
      }
      if (isModified) {
        await user.save();
      }
    } else {
      // Register new user with Google identity SSO (automatically set isVerified = true)
      user = await User.create({
        name: name || 'Google User',
        email,
        googleId,
        role: 'user',
        isVerified: true
      });
      // Send Welcome email asynchronously
      await sendWelcomeEmail(user.name, user.email).catch(console.error);
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
 * @desc    Generate password reset OTP and trigger email
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

    // Generate 6-digit OTP
    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.otpType = 'forgot';
    user.otpAttempts = 0;

    await user.save({ validateBeforeSave: false });

    // Send Forgot Password OTP Email
    await sendForgotPasswordOTPEmail(user.name, user.email, otp).catch(console.error);

    res.status(200).json({
      success: true,
      message: 'A 6-digit security code has been sent to your email address.',
      email: user.email
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
 * @desc    Reset password (called after successful forgot OTP verification)
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

/**
 * @route   POST /api/auth/order-confirmation
 * @desc    Send order confirmation invoice email
 * @access  Public
 */
router.post('/order-confirmation', async (req, res) => {
  const { name, email, orderId, total, paymentMethod, deliveryEstimate, items } = req.body;

  if (!email || !orderId || !total || !items) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required order details.'
    });
  }

  try {
    await sendOrderConfirmationEmail({
      name: name || 'Customer',
      email,
      orderId,
      total,
      paymentMethod: paymentMethod || 'Payment Card',
      deliveryEstimate: deliveryEstimate || '5 business days',
      items
    });

    res.status(200).json({
      success: true,
      message: 'Order confirmation email sent successfully!'
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send order confirmation email.'
    });
  }
});

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update logged-in user's name, phone, gender
 * @access  Private
 */
router.put('/update-profile', protect, async (req, res) => {
  const { name, phone, gender } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name && name.trim()) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (gender !== undefined) user.gender = gender;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        savedAddresses: user.savedAddresses,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error updating profile.' });
  }
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password for logged-in user (requires current password verification)
 * @access  Private
 */
router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide both current and new password.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
  }

  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Google SSO users may not have a password
    if (!user.password) {
      return res.status(400).json({ success: false, message: 'Password change is not available for Google login accounts.' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error changing password.' });
  }
});

module.exports = router;

