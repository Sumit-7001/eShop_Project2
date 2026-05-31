const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const Order = require('./models/Order');
const User = require('./models/User');
const Product = require('./models/Product');

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    console.log(`Users: ${usersCount}`);
    console.log(`Products: ${productsCount}`);
    console.log(`Orders: ${ordersCount}`);
    
    if (ordersCount > 0) {
      const orders = await Order.find().limit(5);
      console.log('Sample Orders:', JSON.stringify(orders, null, 2));
    } else {
      console.log('No orders in database!');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

check();
