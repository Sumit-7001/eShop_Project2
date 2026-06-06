const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email address'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email address'
    ]
  },
  password: {
    type: String,
    required: function() {
      // Password is only required if standard credentials auth is used (not Google SSO)
      return !this.googleId;
    },
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Exclude from queries by default for safety
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  googleId: {
    type: String,
    default: null
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  otpCode: String,
  otpExpire: Date,
  otpAttempts: {
    type: Number,
    default: 0
  },
  otpType: String,
  savedAddresses: [{
    label: { type: String, default: 'Home' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, default: 'India' }
  }],
  phone: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', ''],
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash password before storing in MongoDB
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match user entered password with database hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'eshop_secret_key_12345',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
