/**
 * ── eShop Admin Seeder Script ──────────────────────────────
 * Run once to create an admin user in MongoDB:
 *   node backend/createAdmin.js
 * ──────────────────────────────────────────────────────────
 */

require('dotenv').config({ path: __dirname + '/.env' });

const dns = require('dns');

// Use Google DNS servers to resolve MongoDB SRV hostnames reliably on Windows/certain ISPs
if (typeof dns.setServers === 'function') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (err) {
    console.warn('⚠️ Failed to set custom DNS servers:', err.message);
  }
}

const mongoose = require('mongoose');
const bcrypt    = require('bcryptjs');
const User      = require('./models/User');

// ── Admin credentials — change as needed ──────────────────
const ADMIN_NAME     = 'Store Owner';
const ADMIN_EMAIL    = 'admin@MarketHub.com';
const ADMIN_PASSWORD = 'Admin@123';   // min 6 chars
// ──────────────────────────────────────────────────────────

async function createAdmin() {
  try {
    console.log('🔌  Connecting to MongoDB…');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  Connected.\n');

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      if (existing.role === 'admin') {
        console.log('ℹ️   Admin user already exists:');
        console.log(`    Email    : ${existing.email}`);
        console.log(`    Role     : ${existing.role}`);
        console.log(`    Verified : ${existing.isVerified}`);
        console.log('\n👉  Use the credentials above to login.\n');
      } else {
        // Upgrade existing user to admin
        existing.role       = 'admin';
        existing.isVerified = true;
        await existing.save({ validateBeforeSave: false });
        console.log('🔼  Existing user upgraded to ADMIN:');
        console.log(`    Email : ${existing.email}`);
        console.log(`    Role  : admin\n`);
      }
      process.exit(0);
    }

    // Hash password manually (pre-save hook will also run, but we ensure it)
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create admin user — bypass pre-save hash by setting already-hashed pass
    const admin = new User({
      name       : ADMIN_NAME,
      email      : ADMIN_EMAIL,
      password   : ADMIN_PASSWORD,   // pre-save hook will hash this
      role       : 'admin',
      isVerified : true,             // no OTP needed
      otpAttempts: 0,
    });

    await admin.save();

    console.log('🎉  Admin user created successfully!\n');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│          ADMIN LOGIN CREDENTIALS         │');
    console.log('├─────────────────────────────────────────┤');
    console.log(`│  Email    :  ${ADMIN_EMAIL.padEnd(27)}│`);
    console.log(`│  Password :  ${ADMIN_PASSWORD.padEnd(27)}│`);
    console.log(`│  Role     :  admin                      │`);
    console.log('└─────────────────────────────────────────┘');
    console.log('\n👉  Now go to http://localhost:5173 → Login → then visit /admin\n');

  } catch (err) {
    console.error('❌  Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
