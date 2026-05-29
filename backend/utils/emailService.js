const nodemailer = require('nodemailer');

// ── Email dispatch engine (Supports Nodemailer SMTP and Resend HTTP API) ────────
const sendEmail = async ({ to, subject, html, text, otp = null }) => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465');
  const smtpUser = process.env.SMTP_USER || 'sahoosumit7001@gmail.com';
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const fromName = 'eShop';

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

      const mailOptions = {
        from: `"${fromName}" <${smtpUser}>`,
        to,
        subject,
        html,
        text: text || subject
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
const BRAND_LOGO_ICON = `<span style="background:#ff4d4d;color:#ffffff;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;font-size:20px;font-weight:900;text-align:center;line-height:36px;font-family:'Outfit',sans-serif;margin-right:8px;">e</span>`;
const BRAND_LOGO_TEXT = `<span style="color:#1a1a1a;font-family:'Outfit',sans-serif;font-size:24px;font-weight:900;">Shop</span>`;



/**
 * ── WELCOME EMAIL TEMPLATE ───────────────────────────────────────────────
 */
const sendWelcomeEmail = async (name, email) => {
  const subject = 'Welcome to eShop! 🛍️ Your premium shopping journey begins here';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to eShop</title>
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
            <p>We are absolutely thrilled to welcome you to the <strong>eShop</strong> community! You have successfully created your new customer profile.</p>
            <p>At eShop, we are dedicated to providing you with the highest quality products, lightning-fast delivery, and an exceptional customer service experience that will keep you coming back.</p>
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
            <p>You received this email because you registered on eShop.</p>
            <div class="social-links">
              <a href="#">Facebook</a> | <a href="#">Instagram</a> | <a href="#">Twitter</a>
            </div>
            <p style="margin-top: 20px; font-size: 11px;">&copy; 2026 eShop. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const text = `Hi ${name}, welcome to eShop! Your premium shopping journey begins now. Start exploring at ${process.env.CLIENT_URL || 'http://localhost:5173'}`;
  
  return await sendEmail({ to: email, subject, html, text });
};

/**
 * ── VERIFICATION OTP EMAIL TEMPLATE ──────────────────────────────────────
 */
const sendVerificationOTPEmail = async (name, email, otp) => {
  const subject = `eShop Verification Code: ${otp}`;
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
            <p style="color: #666666;">Hi ${name}, thank you for registering with eShop! Please enter the 6-digit security code below in the verification form to activate your account.</p>
            <div class="otp-box">${otp}</div>
            <p style="color: #ff4d4d; font-weight: 600; font-size: 13px;">⚠️ This security verification code will expire in 5 minutes.</p>
            <p style="color: #888888; font-size: 12px; margin-top: 20px;">If you did not request this registration, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 eShop. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const text = `Hi ${name}, please verify your eShop account email. Your 6-digit verification code is: ${otp}. This code expires in 5 minutes.`;

  return await sendEmail({ to: email, subject, html, text, otp });
};

/**
 * ── FORGOT PASSWORD OTP EMAIL TEMPLATE ────────────────────────────────────
 */
const sendForgotPasswordOTPEmail = async (name, email, otp) => {
  const subject = `eShop Password Reset Code: ${otp}`;
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
            <p style="color: #666666;">Hi ${name}, we received a request to reset the password for your eShop account. Please enter the 6-digit verification code below to authorize your password reset.</p>
            <div class="otp-box">${otp}</div>
            <p style="color: #ff4d4d; font-weight: 600; font-size: 13px;">⚠️ This security verification code will expire in 5 minutes.</p>
            <p style="color: #888888; font-size: 12px; margin-top: 20px;">If you did not request a password reset, you can safely ignore this email and your password will remain secure.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 eShop. All rights reserved.</p>
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
  const subject = 'Security Alert: New Sign-in detected on your eShop profile 🔒';

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
            <h2 style="font-size: 20px; font-weight: 800; color: #1a1a1a; margin-top: 0; text-align: center;">New Sign-in detected on eShop</h2>
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
            <p style="color: #ff4d4d; font-weight: 700; font-size: 13px; text-align: center;">⚠️ If you did not log in, please reset your password immediately inside eShop profile settings.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 eShop. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const text = `Security Alert: A new sign-in was detected on your eShop profile. Time: ${loginTime}, IP: ${ip}, Browser: ${browser}, Device: ${device}`;

  return await sendEmail({ to: email, subject, html, text });
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationOTPEmail,
  sendForgotPasswordOTPEmail,
  sendLoginAlertEmail
};
