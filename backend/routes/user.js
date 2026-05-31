const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile and saved addresses
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
});

/**
 * @route   PUT /api/users/profile/addresses
 * @desc    Add a new saved address to user profile
 * @access  Private
 */
router.put('/profile/addresses', protect, async (req, res) => {
  const { label, name, phone, address, city, state, zip, country } = req.body;

  if (!name || !phone || !address || !city || !state || !zip) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required address details.'
    });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const newAddress = {
      label: label || 'Home',
      name,
      phone,
      address,
      city,
      state,
      zip,
      country: country || 'India'
    };

    user.savedAddresses.push(newAddress);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Shipping address saved successfully!',
      savedAddresses: user.savedAddresses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error saving address.' });
  }
});

/**
 * @route   DELETE /api/users/profile/addresses/:addressId
 * @desc    Remove a saved shipping address from user profile
 * @access  Private
 */
router.delete('/profile/addresses/:addressId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.savedAddresses = user.savedAddresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );
    
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Shipping address deleted successfully!',
      savedAddresses: user.savedAddresses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting address.' });
  }
});

/**
 * @route   GET /api/users
 * @desc    Retrieve all users (Admin only)
 * @access  Private/Admin
 */
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving users.' });
  }
});

module.exports = router;
