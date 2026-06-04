const nodemailer = require('nodemailer');

// ── Email dispatch engine (Supports Nodemailer SMTP and Resend HTTP API) ────────
const sendEmail = async ({ to, subject, html, text, otp = null }) => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465');
  const smtpUser = process.env.SMTP_USER || 'sahoosumit7001@gmail.com';
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const fromName = 'MarketHub';

  // ── 1. Use Nodemailer SMTP if Password is configured (RECOMMENDED FOR FREE UNIVERSAL DELIVERY) ──
  if (smtpPass && smtpPass !== 'your_smtp_app_password_here') {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const logoPath = require('path').join(__dirname, '../../public/favicon.png');
      const mailOptions = {
        from: `"${fromName}" <${smtpUser}>`,
        to,
        subject,
        html,
        text: text || subject,
        attachments: require('fs').existsSync(logoPath) ? [{
          filename: 'favicon.png',
          path: logoPath,
          cid: 'markethublogo'
        }] : []
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ [EMAIL SENT VIA SMTP] MessageID: ${info.messageId} → ${to}`);
      return true;
    } catch (error) {
      console.error('❌ [SMTP EMAIL ERROR]:', error.message);
      // Let it fall back to Resend API if SMTP fails
    }
  }

  // ── 2. Use Resend API if key is configured ────────────────────────────────────
  if (apiKey && apiKey !== 'your_resend_api_key_here') {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [to],
          subject,
          html,
          text: text || subject
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Resend API error: ${response.status}`);
      }

      console.log(`✅ [EMAIL SENT VIA RESEND] ID: ${data.id} → ${to}`);
      return true;
    } catch (error) {
      console.error('❌ [RESEND EMAIL ERROR]:', error.message);
    }
  }

  // ── 3. FALLBACK: Console log (dev mode / no SMTP or Resend API key) ──────────
  console.log('\n' + '='.repeat(80));
  console.log(`✉️  [EMAIL FALLBACK - No SMTP or RESEND_API_KEY configured]`);
  console.log(`👉  TO:      ${to}`);
  console.log(`👉  SUBJECT: ${subject}`);
  if (otp) console.log(`🔥  OTP CODE: ${otp}`);
  console.log('='.repeat(80) + '\n');
  return true;
};

const BRAND_COLOR = '#ff4d4d';
const BRAND_LOGO_ICON = `<img src="cid:markethublogo" alt="MarketHub" style="width:36px;height:36px;border-radius:10px;margin-right:8px;object-fit:cover;" />`;
const BRAND_LOGO_TEXT = `<span style="color:#1a1a1a;font-family:'Outfit',sans-serif;font-size:24px;font-weight:900;">MarketHub</span>`;



/**
 * ── WELCOME EMAIL TEMPLATE ───────────────────────────────────────────────
 */
const sendWelcomeEmail = async (name, email) => {
  const subject = 'Welcome to MarketHub! 🛍️ Your premium shopping journey begins here';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MarketHub</title>
        <style>
          body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333333; margin: 0; padding: 0; -webkit-text-size-adjust: none; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; margin-top: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { background: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #f0f0f5; }
          .content { padding: 40px 30px; line-height: 1.6; }
          .footer { background-color: #f9f9fc; padding: 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #f0f0f5; }
          .btn { display: inline-block; background-color: #000000; color: #ffffff !important; text-decoration: none; padding: 12px 30px; border-radius: 9999px; font-weight: 700; font-size: 15px; margin-top: 20px; text-align: center; }
          .social-links { margin-top: 20px; }
          .social-links a { margin: 0 10px; color: #ff4d4d; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="display:inline-flex; align-items:center; justify-content:center;">
              ${BRAND_LOGO_ICON}
              ${BRAND_LOGO_TEXT}
            </div>
          </div>
          <div class="content">
            <h2 style="font-size: 22px; font-weight: 800; color: #1a1a1a; margin-top: 0;">Hi ${name}, welcome! 👋</h2>
            <p>We are absolutely thrilled to welcome you to the <strong>MarketHub</strong> community! You have successfully created your new customer profile.</p>
            <p>At MarketHub, we are dedicated to providing you with the highest quality products, lightning-fast delivery, and an exceptional customer service experience that will keep you coming back.</p>
            <p>Here is what you can do right now:</p>
            <ul style="padding-left: 20px; margin-bottom: 20px;">
              <li>Explore our latest premium arrivals and seasonal promotions.</li>
              <li>Add products to your wishlist or compare features easily.</li>
              <li>Access fast and secure checkout.</li>
            </ul>
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="btn">Start Shopping Now</a>
            </div>
          </div>
          <div class="footer">
            <p>You received this email because you registered on MarketHub.</p>
            <div class="social-links">
              <a href="#">Facebook</a> | <a href="#">Instagram</a> | <a href="#">Twitter</a>
            </div>
            <p style="margin-top: 20px; font-size: 11px;">&copy; 2026 MarketHub. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const text = `Hi ${name}, welcome to MarketHub! Your premium shopping journey begins now. Start exploring at ${process.env.CLIENT_URL || 'http://localhost:5173'}`;
  
  return await sendEmail({ to: email, subject, html, text });
};

/**
 * ── VERIFICATION OTP EMAIL TEMPLATE ──────────────────────────────────────
 */
const sendVerificationOTPEmail = async (name, email, otp) => {
  const subject = `MarketHub Verification Code: ${otp}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; margin-top: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { background: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #f0f0f5; }
          .content { padding: 40px 30px; text-align: center; }
          .otp-box { background-color: #f4f4f6; border-radius: 16px; padding: 24px 40px; display: inline-block; margin: 24px 0; letter-spacing: 6px; font-size: 32px; font-weight: 800; color: #000000; border: 1px solid #e4e4e7; }
          .footer { background-color: #f9f9fc; padding: 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #f0f0f5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="display:inline-flex; align-items:center; justify-content:center;">
              ${BRAND_LOGO_ICON}
              ${BRAND_LOGO_TEXT}
            </div>
          </div>
          <div class="content">
            <h2 style="font-size: 22px; font-weight: 800; color: #1a1a1a; margin-top: 0;">Verify your email address</h2>
            <p style="color: #666666;">Hi ${name}, thank you for registering with MarketHub! Please enter the 6-digit security code below in the verification form to activate your account.</p>
            <div class="otp-box">${otp}</div>
            <p style="color: #ff4d4d; font-weight: 600; font-size: 13px;">⚠️ This security verification code will expire in 5 minutes.</p>
            <p style="color: #888888; font-size: 12px; margin-top: 20px;">If you did not request this registration, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 MarketHub. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const text = `Hi ${name}, please verify your MarketHub account email. Your 6-digit verification code is: ${otp}. This code expires in 5 minutes.`;

  return await sendEmail({ to: email, subject, html, text, otp });
};

/**
 * ── FORGOT PASSWORD OTP EMAIL TEMPLATE ────────────────────────────────────
 */
const sendForgotPasswordOTPEmail = async (name, email, otp) => {
  const subject = `MarketHub Password Reset Code: ${otp}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password Code</title>
        <style>
          body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; margin-top: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { background: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #f0f0f5; }
          .content { padding: 40px 30px; text-align: center; }
          .otp-box { background-color: #f4f4f6; border-radius: 16px; padding: 24px 40px; display: inline-block; margin: 24px 0; letter-spacing: 6px; font-size: 32px; font-weight: 800; color: #000000; border: 1px solid #e4e4e7; }
          .footer { background-color: #f9f9fc; padding: 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #f0f0f5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="display:inline-flex; align-items:center; justify-content:center;">
              ${BRAND_LOGO_ICON}
              ${BRAND_LOGO_TEXT}
            </div>
          </div>
          <div class="content">
            <h2 style="font-size: 22px; font-weight: 800; color: #1a1a1a; margin-top: 0;">Password reset request</h2>
            <p style="color: #666666;">Hi ${name}, we received a request to reset the password for your MarketHub account. Please enter the 6-digit verification code below to authorize your password reset.</p>
            <div class="otp-box">${otp}</div>
            <p style="color: #ff4d4d; font-weight: 600; font-size: 13px;">⚠️ This security verification code will expire in 5 minutes.</p>
            <p style="color: #888888; font-size: 12px; margin-top: 20px;">If you did not request a password reset, you can safely ignore this email and your password will remain secure.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 MarketHub. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const text = `Hi ${name}, you requested a password reset. Your 6-digit reset code is: ${otp}. This code expires in 5 minutes.`;

  return await sendEmail({ to: email, subject, html, text, otp });
};

/**
 * ── LOGIN ALERT EMAIL TEMPLATE ────────────────────────────────────────────
 */
const sendLoginAlertEmail = async (user, req) => {
  const email = user.email;
  const name = user.name;
  const subject = 'Security Alert: New Sign-in detected on your MarketHub profile 🔒';

  // Parse User Agent strings natively for speed and simplicity
  const userAgent = req.headers['user-agent'] || 'Unknown Browser';
  let browser = 'Unknown Browser';
  let device = 'Unknown Device';

  if (/chrome|crios/i.test(userAgent)) browser = 'Google Chrome';
  else if (/firefox|fxios/i.test(userAgent)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(userAgent)) browser = 'Apple Safari';
  else if (/edge|edg/i.test(userAgent)) browser = 'Microsoft Edge';
  else if (/opr/i.test(userAgent)) browser = 'Opera';

  if (/iphone/i.test(userAgent)) device = 'Apple iPhone';
  else if (/ipad/i.test(userAgent)) device = 'Apple iPad';
  else if (/android/i.test(userAgent)) device = 'Android Mobile Phone';
  else if (/macintosh|mac os/i.test(userAgent)) device = 'macOS Desktop';
  else if (/windows/i.test(userAgent)) device = 'Windows Desktop';
  else if (/linux/i.test(userAgent)) device = 'Linux Desktop';

  const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
  const loginTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' (IST)';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Login Alert</title>
        <style>
          body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; margin-top: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { background: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #f0f0f5; }
          .content { padding: 40px 30px; }
          .info-table { width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #f9f9fc; border-radius: 12px; overflow: hidden; }
          .info-table td { padding: 14px 20px; border-bottom: 1px solid #eeeeee; font-size: 14px; }
          .info-table td.label { font-weight: 700; color: #555555; width: 130px; }
          .info-table td.value { color: #1a1a1a; font-family: monospace; }
          .footer { background-color: #f9f9fc; padding: 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #f0f0f5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="display:inline-flex; align-items:center; justify-content:center;">
              ${BRAND_LOGO_ICON}
              ${BRAND_LOGO_TEXT}
            </div>
          </div>
          <div class="content">
            <h2 style="font-size: 20px; font-weight: 800; color: #1a1a1a; margin-top: 0; text-align: center;">New Sign-in detected on MarketHub</h2>
            <p style="color: #666666; text-align: center;">Hi ${name}, a new successful login was recorded for your account. Please review the security parameters below to ensure this access was authorized by you.</p>
            <table class="info-table">
              <tr>
                <td class="label">Date & Time</td>
                <td class="value">${loginTime}</td>
              </tr>
              <tr>
                <td class="label">IP Address</td>
                <td class="value">${ip}</td>
              </tr>
              <tr>
                <td class="label">Browser</td>
                <td class="value">${browser}</td>
              </tr>
              <tr>
                <td class="label">Device System</td>
                <td class="value">${device}</td>
              </tr>
            </table>
            <p style="color: #888888; font-size: 13px; text-align: center; margin-top: 20px;">If this was you, no action is required! Happy shopping. 🛍️</p>
            <p style="color: #ff4d4d; font-weight: 700; font-size: 13px; text-align: center;">⚠️ If you did not log in, please reset your password immediately inside MarketHub profile settings.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 MarketHub. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const text = `Security Alert: A new sign-in was detected on your MarketHub profile. Time: ${loginTime}, IP: ${ip}, Browser: ${browser}, Device: ${device}`;

  return await sendEmail({ to: email, subject, html, text });
};

/**
 * ── ORDER CONFIRMATION EMAIL TEMPLATE ─────────────────────────────────────
 */
const sendOrderConfirmationEmail = async ({ name, email, orderId, total, paymentMethod, deliveryEstimate, items }) => {
  const subject = `Order Confirmed! 🛍️ Invoice for Order ${orderId}`;
  
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${item.image}" alt="${item.title}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;" />
          <div>
            <div style="font-weight: 700; color: #1a1a1a; font-size: 14px;">${item.title}</div>
            <div style="font-size: 12px; color: #888888;">Qty: ${item.quantity}</div>
          </div>
        </div>
      </td>
      <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: 700; color: #1a1a1a;">
        $${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; margin-top: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { background: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #f0f0f5; }
          .content { padding: 40px 30px; }
          .order-card { background-color: #f9f9fc; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
          .order-details-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .order-details-table td { padding: 6px 0; font-size: 14px; }
          .order-details-table td.label { color: #666666; font-weight: 500; }
          .order-details-table td.value { color: #1a1a1a; font-weight: 700; text-align: right; }
          .receipt-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .receipt-table th { padding: 12px 15px; background-color: #f4f4f6; text-align: left; font-size: 13px; font-weight: 700; color: #555555; }
          .footer { background-color: #f9f9fc; padding: 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #f0f0f5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="display:inline-flex; align-items:center; justify-content:center;">
              ${BRAND_LOGO_ICON}
              ${BRAND_LOGO_TEXT}
            </div>
          </div>
          <div class="content">
            <h2 style="font-size: 22px; font-weight: 800; color: #1a1a1a; margin-top: 0; text-align: center;">Order Placed Successfully! 🎉</h2>
            <p style="text-align: center; color: #666666; margin-bottom: 30px;">Hi ${name}, thank you for your order! We are preparing your shipment. Below is your detailed receipt invoice.</p>
            
            <div class="order-card">
              <h4 style="margin-top:0; margin-bottom: 12px; font-size: 15px; font-weight: 800; color: #ff4d4d; text-transform: uppercase;">Order Details</h4>
              <table class="order-details-table">
                <tr>
                  <td class="label">Order ID</td>
                  <td class="value">${orderId}</td>
                </tr>
                <tr>
                  <td class="label">Payment Method</td>
                  <td class="value">${paymentMethod}</td>
                </tr>
                <tr>
                  <td class="label">Est. Delivery</td>
                  <td class="value">${deliveryEstimate}</td>
                </tr>
                <tr style="border-top: 1px solid #e4e4e7; height: 10px;"><td colspan="2"></td></tr>
                <tr>
                  <td class="label" style="font-size: 15px; font-weight: 800; color: #1a1a1a;">Total Paid</td>
                  <td class="value" style="font-size: 18px; font-weight: 800; color: #ff4d4d;">$${total.toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <h4 style="font-size: 15px; font-weight: 800; color: #1a1a1a; margin-bottom: 12px;">Items Ordered</h4>
            <table class="receipt-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: right; width: 100px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <p style="color: #888888; font-size: 12px; text-align: center; margin-top: 30px;">If you have any questions or would like to modify your order, please contact support.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 MarketHub. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Order Confirmation: Your order ${orderId} has been placed successfully. Total: $${total.toLocaleString()}. Est. Delivery: ${deliveryEstimate}.`;

  return await sendEmail({ to: email, subject, html, text });
};

const sendOrderStatusUpdateEmail = async ({ name, email, orderId, status, total, paymentMethod, estimatedDelivery, statusMessage }) => {
  const subject = `Order Update: Your Order ${orderId} is now ${status} 🚚`;
  
  const statuses = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentIndex = statuses.indexOf(status);
  
  const isStep1Done = currentIndex > 0;
  const isLine1Done = currentIndex > 0;
  
  const isStep2Done = currentIndex > 1;
  const isLine2Done = currentIndex > 1;
  
  const isStep3Done = currentIndex > 2;
  const isLine3Done = currentIndex > 2;
  
  const isStep4Done = currentIndex > 3;
  const isLine4Done = currentIndex > 3;

  const getStatusColor = (st) => {
    switch (st) {
      case 'Placed': return '#10b981';
      case 'Processing': return '#ff7a00';
      case 'Shipped': return '#8b5cf6';
      case 'Out for Delivery': return '#3b82f6';
      case 'Delivered': return '#10b981';
      default: return '#ff4d4d';
    }
  };

  const getStatusIcon = (st) => {
    switch (st) {
      case 'Placed': return '📥';
      case 'Processing': return '⚙️';
      case 'Shipped': return '📦';
      case 'Out for Delivery': return '🚚';
      case 'Delivered': return '🎁';
      default: return '🔔';
    }
  };

  const activeColor = getStatusColor(status);
  const statusIcon = getStatusIcon(status);
  
  const formattedEstimate = estimatedDelivery ? new Date(estimatedDelivery).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'N/A';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Tracking Update</title>
        <style>
          body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; margin-top: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          .header { background: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #f0f0f5; }
          .content { padding: 40px 30px; }
          .status-banner { border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px; color: #ffffff; }
          .order-card { background-color: #f9f9fc; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
          .order-details-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .order-details-table td { padding: 6px 0; font-size: 14px; }
          .order-details-table td.label { color: #666666; font-weight: 500; }
          .order-details-table td.value { color: #1a1a1a; font-weight: 700; text-align: right; }
          .footer { background-color: #f9f9fc; padding: 30px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #f0f0f5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="display:inline-flex; align-items:center; justify-content:center;">
              ${BRAND_LOGO_ICON}
              ${BRAND_LOGO_TEXT}
            </div>
          </div>
          <div class="content">
            <div class="status-banner" style="background-color: ${activeColor};">
              <span style="font-size: 40px; display: block; margin-bottom: 8px;">${statusIcon}</span>
              <h2 style="margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Order Status: ${status}</h2>
            </div>
            
            <p style="color: #666666; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
            <p style="color: #666666; line-height: 1.6;">Good news! The status of your order <strong>${orderId}</strong> has been updated. Here is what is currently happening with your package:</p>
            
            <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; border-radius: 4px; font-size: 14px; font-weight: 500; color: #14532d; margin-bottom: 25px; line-height: 1.5;">
              📢 ${statusMessage || `Your order is currently ${status.toLowerCase()}.`}
            </div>

            <!-- --- Premium Timeline Visual Progress --- -->
            <h4 style="font-size: 12px; font-weight: 800; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; text-align: center;">Delivery Progress</h4>
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 25px 0 35px 0;">
              <tr>
                <td align="center">
                  <table border="0" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 500px;">
                    <tr>
                      <!-- Step 1: Placed -->
                      <td align="center" style="width: 10%; vertical-align: top;">
                        <div style="width: 32px; height: 32px; line-height: 30px; border-radius: 50%; font-size: 13px; font-weight: bold; text-align: center; background-color: ${status === 'Placed' ? '#10b981' : isStep1Done ? '#10b981' : '#f1f5f9'}; color: ${status === 'Placed' || isStep1Done ? '#ffffff' : '#94a3b8'}; border: ${status === 'Placed' ? '2px solid #b9f6ca' : 'none'}; box-sizing: border-box;">
                          ${isStep1Done ? '✓' : '1'}
                        </div>
                        <div style="font-size: 9px; font-weight: 800; color: ${status === 'Placed' || isStep1Done ? '#10b981' : '#64748b'}; margin-top: 8px;">PLACED</div>
                      </td>
                      
                      <!-- Line 1 -->
                      <td style="width: 12.5%; padding-top: 14px; vertical-align: top;">
                        <div style="height: 4px; background-color: ${isLine1Done ? '#10b981' : '#e2e8f0'}; border-radius: 2px;"></div>
                      </td>

                      <!-- Step 2: Processing -->
                      <td align="center" style="width: 10%; vertical-align: top;">
                        <div style="width: 32px; height: 32px; line-height: 30px; border-radius: 50%; font-size: 13px; font-weight: bold; text-align: center; background-color: ${status === 'Processing' ? '#ff7a00' : isStep2Done ? '#10b981' : '#f1f5f9'}; color: ${status === 'Processing' || isStep2Done ? '#ffffff' : '#94a3b8'}; border: ${status === 'Processing' ? '2px solid #ffefe0' : 'none'}; box-sizing: border-box;">
                          ${isStep2Done ? '✓' : '2'}
                        </div>
                        <div style="font-size: 9px; font-weight: 800; color: ${status === 'Processing' ? '#ff7a00' : isStep2Done ? '#10b981' : '#64748b'}; margin-top: 8px;">PROCESSING</div>
                      </td>

                      <!-- Line 2 -->
                      <td style="width: 12.5%; padding-top: 14px; vertical-align: top;">
                        <div style="height: 4px; background-color: ${isLine2Done ? '#10b981' : '#e2e8f0'}; border-radius: 2px;"></div>
                      </td>

                      <!-- Step 3: Shipped -->
                      <td align="center" style="width: 10%; vertical-align: top;">
                        <div style="width: 32px; height: 32px; line-height: 30px; border-radius: 50%; font-size: 13px; font-weight: bold; text-align: center; background-color: ${status === 'Shipped' ? '#8b5cf6' : isStep3Done ? '#10b981' : '#f1f5f9'}; color: ${status === 'Shipped' || isStep3Done ? '#ffffff' : '#94a3b8'}; border: ${status === 'Shipped' ? '2px solid #ede9fe' : 'none'}; box-sizing: border-box;">
                          ${isStep3Done ? '✓' : '3'}
                        </div>
                        <div style="font-size: 9px; font-weight: 800; color: ${status === 'Shipped' ? '#8b5cf6' : isStep3Done ? '#10b981' : '#64748b'}; margin-top: 8px;">SHIPPED</div>
                      </td>

                      <!-- Line 3 -->
                      <td style="width: 12.5%; padding-top: 14px; vertical-align: top;">
                        <div style="height: 4px; background-color: ${isLine3Done ? '#10b981' : '#e2e8f0'}; border-radius: 2px;"></div>
                      </td>

                      <!-- Step 4: Out for Delivery -->
                      <td align="center" style="width: 10%; vertical-align: top;">
                        <div style="width: 32px; height: 32px; line-height: 30px; border-radius: 50%; font-size: 13px; font-weight: bold; text-align: center; background-color: ${status === 'Out for Delivery' ? '#3b82f6' : isStep4Done ? '#10b981' : '#f1f5f9'}; color: ${status === 'Out for Delivery' || isStep4Done ? '#ffffff' : '#94a3b8'}; border: ${status === 'Out for Delivery' ? '2px solid #dbeafe' : 'none'}; box-sizing: border-box;">
                          ${isStep4Done ? '✓' : '4'}
                        </div>
                        <div style="font-size: 9px; font-weight: 800; color: ${status === 'Out for Delivery' ? '#3b82f6' : isStep4Done ? '#10b981' : '#64748b'}; margin-top: 8px; text-transform: uppercase;">TRANSIT</div>
                      </td>

                      <!-- Line 4 -->
                      <td style="width: 12.5%; padding-top: 14px; vertical-align: top;">
                        <div style="height: 4px; background-color: ${isLine4Done ? '#10b981' : '#e2e8f0'}; border-radius: 2px;"></div>
                      </td>

                      <!-- Step 5: Delivered -->
                      <td align="center" style="width: 10%; vertical-align: top;">
                        <div style="width: 32px; height: 32px; line-height: 30px; border-radius: 50%; font-size: 13px; font-weight: bold; text-align: center; background-color: ${status === 'Delivered' ? '#10b981' : '#f1f5f9'}; color: ${status === 'Delivered' ? '#ffffff' : '#94a3b8'}; border: ${status === 'Delivered' ? '2px solid #b9f6ca' : 'none'}; box-sizing: border-box;">
                          ${status === 'Delivered' ? '✓' : '5'}
                        </div>
                        <div style="font-size: 9px; font-weight: 800; color: ${status === 'Delivered' ? '#10b981' : '#64748b'}; margin-top: 8px;">DELIVERED</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <div class="order-card">
              <h4 style="margin-top:0; margin-bottom: 12px; font-size: 14px; font-weight: 800; color: ${activeColor}; text-transform: uppercase; letter-spacing: 0.5px;">Delivery Details</h4>
              <table class="order-details-table">
                <tr>
                  <td class="label">Order ID</td>
                  <td class="value" style="font-family: monospace;">${orderId}</td>
                </tr>
                <tr>
                  <td class="label">Payment Method</td>
                  <td class="value">${paymentMethod}</td>
                </tr>
                <tr>
                  <td class="label">Est. Delivery Estimate</td>
                  <td class="value" style="color: ${activeColor}; font-weight: 800;">${formattedEstimate}</td>
                </tr>
                <tr style="border-top: 1px solid #e4e4e7; height: 10px;"><td colspan="2"></td></tr>
                <tr>
                  <td class="label" style="font-size: 14px; font-weight: 800; color: #1a1a1a;">Total Value</td>
                  <td class="value" style="font-size: 16px; font-weight: 800; color: #1a1a1a;">$${total.toLocaleString()}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/profile/track/${orderId}" style="display: inline-block; background-color: ${activeColor}; color: #ffffff !important; text-decoration: none; padding: 12px 30px; border-radius: 9999px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px ${activeColor}33;">Track Your Order Live</a>
            </div>

            <p style="color: #888888; font-size: 12px; text-align: center; margin-top: 35px; line-height: 1.5;">If you have any questions or require immediate support with your delivery, please do not hesitate to contact our customer support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 MarketHub. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `Order Update: Your order ${orderId} has been updated to ${status}. Update: ${statusMessage}`;

  return await sendEmail({ to: email, subject, html, text });
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationOTPEmail,
  sendForgotPasswordOTPEmail,
  sendLoginAlertEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail
};
