const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Retrieve all products from the database
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving products.' });
  }
});

/**
 * @route   POST /api/products
 * @desc    Add a new product
 * @access  Private/Admin
 */
router.post('/', protect, admin, async (req, res) => {
  const { title, price, oldPrice, category, image, sale, description } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, price, and category.'
    });
  }

  try {
    const id = Date.now();

    const product = await Product.create({
      id,
      title,
      price,
      oldPrice,
      category,
      image,
      sale: sale || false,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully!',
      product
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Server error adding product.' });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update an existing product
 * @access  Private/Admin
 */
router.put('/:id', protect, admin, async (req, res) => {
  const numericId = parseInt(req.params.id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID format.' });
  }

  try {
    let product = await Product.findOne({ id: numericId });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    product = await Product.findOneAndUpdate(
      { id: numericId },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Server error updating product.' });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, async (req, res) => {
  const numericId = parseInt(req.params.id, 10);

  if (isNaN(numericId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID format.' });
  }

  try {
    const product = await Product.findOne({ id: numericId });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    await Product.findOneAndDelete({ id: numericId });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Server error deleting product.' });
  }
});

module.exports = router;
