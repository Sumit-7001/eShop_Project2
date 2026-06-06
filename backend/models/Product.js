const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Please add a product title'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price']
  },
  oldPrice: {
    type: Number
  },
  rating: {
    type: Number,
    default: 5.0
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&fit=crop'
  },
  sale: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['smartphones', 'watches', 'furniture', 'kids', 'fashion', 'electronics', 'digital-product', 'home-appliances', 'vegetable', 'decor', 'books']
  },
  color: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
