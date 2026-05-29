import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import '../../styles/AuthModal.css';

const MODES = { LOGIN: 'login', SIGNUP: 'signup', FORGOT: 'forgot', RESET: 'reset', VERIFY_OTP: 'verify_otp' };

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { 
    handleLogin, 
    handleRegister, 
    handleGoogleLogin, 
    handleForgotPassword, 
    handleVerifyOTP,
    handleResendOTP,
    handleResetPassword 
  } = useApp();

  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetTokenState, setResetTokenState] = useState('');
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // OTP Verification states
  const [otpValue, setOtpValue] = useState('');
  const [otpType, setOtpType] = useState('verification');
  const [otpEmail, setOtpEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [sandboxOtp, setSandboxOtp] = useState('');

  // Form fields
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetPasswordData, setResetPasswordData] = useState({ password: '', confirmPassword: '' });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Reset states when modal is opened/re-opened
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrors({});
      setIsLoading(false);
      setShowPassword(false);
      setResetTokenState('');
      setLoginData({ identifier: '', password: '' });
      setSignupData({ name: '', email: '', password: '' });
      setFirstName('');
      setLastName('');
      setForgotEmail('');
      setResetPasswordData({ password: '', confirmPassword: '' });
      setOtpValue('');
      setOtpEmail('');
      setCooldown(0);
      setSandboxOtp('');
    }
  }, [isOpen, initialMode]);

  // OTP Resend cooldown timer hook
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(c => c - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleGoogleCallback = async (response) => {
    setIsLoading(true);
    const success = await handleGoogleLogin(response.credential);
    setIsLoading(false);
    if (success) {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen || (mode !== MODES.LOGIN && mode !== MODES.SIGNUP)) return;

    const initializeGoogle = () => {
      if (window.google) {
        setGoogleLoaded(true);
        window.google.accounts.id.initialize({
          client_id: '767934854752-g9ht9cp72o9nlmdlvm05240goinnti63.apps.googleusercontent.com',
          callback: handleGoogleCallback
        });
        
        setTimeout(() => {
          const btnContainer = document.getElementById('google-signin-button');
          if (btnContainer && window.google) {
            window.google.accounts.id.renderButton(btnContainer, {
              theme: 'outline',
              size: 'large',
              width: btnContainer.offsetWidth || 368,
              shape: 'pill',
              text: mode === MODES.SIGNUP ? 'signup_with' : 'signin_with'
            });
          }
        }, 100);
      }
    };

    if (window.google) {
      initializeGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  // ── Validation Helpers ───────────────────────────────────────────────────
  const validateLogin = () => {
    const errs = {};
    if (!loginData.identifier.trim()) errs.identifier = 'Email address is required';
    if (!loginData.password.trim()) errs.password = 'Password is required';
    return errs;
  };

  const validateSignup = () => {
    const errs = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!signupData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errs.email = 'Invalid email address format';
    }
    if (!signupData.password) {
      errs.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    return errs;
  };

  const validateReset = () => {
    const errs = {};
    if (!resetPasswordData.password) {
      errs.password = 'Password is required';
    } else if (resetPasswordData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  // ── Submit Handlers ──────────────────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    const result = await handleLogin(loginData.identifier, loginData.password);
    setIsLoading(false);
    
    if (result) {
      if (result.success) {
        onClose();
      } else if (result.isVerified === false) {
        setOtpEmail(result.email);
        setOtpType('verification');
        setCooldown(60);
        setOtpValue('');
        setSandboxOtp(result.otp || '');
        setMode(MODES.VERIFY_OTP);
      }
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const errs = validateSignup();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const result = await handleRegister(fullName, signupData.email, signupData.password);
    setIsLoading(false);

    if (result && result.success) {
      setOtpEmail(result.email);
      setOtpType('verification');
      setCooldown(60);
      setOtpValue('');
      setSandboxOtp(result.otp || '');
      setMode(MODES.VERIFY_OTP);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setErrors({ forgotEmail: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    const result = await handleForgotPassword(forgotEmail);
    setIsLoading(false);

    if (result && result.success) {
      setOtpEmail(result.email);
      setOtpType('forgot');
      setCooldown(60);
      setOtpValue('');
      setSandboxOtp(result.otp || '');
      setMode(MODES.VERIFY_OTP);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const errs = validateReset();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    const success = await handleResetPassword(resetTokenState, resetPasswordData.password);
    setIsLoading(false);

    if (success) {
      onClose();
    }
  };

  const handleVerifyOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otpValue || otpValue.length < 6) {
      setErrors({ otpValue: 'Please enter a valid 6-digit verification code' });
      return;
    }

    setIsLoading(true);
    const result = await handleVerifyOTP(otpEmail, otpValue, otpType);
    setIsLoading(false);

    if (result && result.success) {
      if (otpType === 'verification') {
        onClose();
      } else {
        setResetTokenState(result.resetToken);
        setMode(MODES.RESET);
      }
    }
  };

  const handleResendOTPClick = async () => {
    if (cooldown > 0) return;
    setCooldown(60);
    const result = await handleResendOTP(otpEmail, otpType);
    if (result && result.otp) {
      setSandboxOtp(result.otp);
    }
  };

  const handleGoogleClick = async () => {
    setIsLoading(true);
    const mockGoogleToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJnb29nbGUudXNlckBlc2hvcC5jb20iLCJuYW1lIjoiR29vZ2xlIFVzZXIifQ.sig";
    const success = await handleGoogleLogin(mockGoogleToken);
    setIsLoading(false);
    
    if (success) {
      onClose();
    }
  };

  const handleChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setIsLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* eShop Brand Logo at top */}
        <div className="modal-logo-wrapper">
          <div className="modal-logo">
            <span className="logo-icon">e</span>
            <span className="logo-text">Shop</span>
          </div>
        </div>

        {/* ── LOGIN ─────────────────────────────────────────────────────── */}
        {mode === MODES.LOGIN && (
          <>
            <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
              {googleLoaded ? (
                <div id="google-signin-button" className="w-full flex justify-center mt-1" style={{ minHeight: '50px' }} />
              ) : (
                <button 
                  type="button" 
                  className="social-login-btn" 
                  onClick={handleGoogleClick} 
                  disabled={isLoading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>
              )}

              <div className="auth-divider">or</div>

              <div className={`form-group ${errors.identifier ? 'has-error' : ''}`}>
                <input
                  id="auth-identifier"
                  type="email"
                  name="identifier"
                  placeholder="Email"
                  value={loginData.identifier}
                  onChange={handleChange(setLoginData)}
                  autoComplete="email"
                />
                {errors.identifier && <span className="field-error"><AlertCircle size={12} />{errors.identifier}</span>}
              </div>

              <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <div className="password-input-split">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleChange(setLoginData)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="field-error"><AlertCircle size={12} />{errors.password}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <span className="btn-spinner" /> : 'Log in'}
              </button>

              <div className="forgot-link-wrapper">
                <button type="button" className="forgot-link" onClick={() => switchMode(MODES.FORGOT)}>
                  Request a New Password
                </button>
              </div>

              <p className="auth-switch-text">
                New here?{' '}
                <button type="button" className="toggle-link" onClick={() => switchMode(MODES.SIGNUP)}>
                  Create an account
                </button>
              </p>
            </form>
          </>
        )}

        {/* ── SIGNUP ────────────────────────────────────────────────────── */}
        {mode === MODES.SIGNUP && (
          <>
            <form className="auth-form" onSubmit={handleSignupSubmit} noValidate>
              {googleLoaded ? (
                <div id="google-signin-button" className="w-full flex justify-center mt-1" style={{ minHeight: '50px' }} />
              ) : (
                <button 
                  type="button" 
                  className="social-login-btn" 
                  onClick={handleGoogleClick} 
                  disabled={isLoading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign up with Google
                </button>
              )}

              <div className="auth-divider">or</div>

              {/* Name Fields side-by-side row */}
              <div className="form-row-2col">
                <div className={`form-group ${errors.firstName ? 'has-error' : ''}`}>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
                    }}
                    autoComplete="given-name"
                  />
                  {errors.firstName && <span className="field-error"><AlertCircle size={12} />{errors.firstName}</span>}
                </div>

                <div className={`form-group ${errors.lastName ? 'has-error' : ''}`}>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
                    }}
                    autoComplete="family-name"
                  />
                  {errors.lastName && <span className="field-error"><AlertCircle size={12} />{errors.lastName}</span>}
                </div>
              </div>

              <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={handleChange(setSignupData)}
                  autoComplete="email"
                />
                {errors.email && <span className="field-error"><AlertCircle size={12} />{errors.email}</span>}
              </div>

              <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <div className="password-input-split">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={handleChange(setSignupData)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="field-error"><AlertCircle size={12} />{errors.password}</span>}
              </div>


              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <span className="btn-spinner" /> : 'Create account'}
              </button>

              <div className="auth-terms-text">
                Signing up for an <span className="font-semibold text-slate-900 dark:text-white">eShop</span> account means you agree to the <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>.
              </div>

              <p className="auth-switch-text">
                Have an account?{' '}
                <button type="button" className="toggle-link" onClick={() => switchMode(MODES.LOGIN)}>
                  Log in here
                </button>
              </p>
            </form>
          </>
        )}

        {/* ── FORGOT PASSWORD ───────────────────────────────────────────── */}
        {mode === MODES.FORGOT && (
          <>
            <form className="auth-form" onSubmit={handleForgotSubmit} noValidate>
              <div className={`form-group ${errors.forgotEmail ? 'has-error' : ''}`}>
                <input
                  id="forgot-email"
                  type="email"
                  name="forgotEmail"
                  placeholder="Email"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                    if (errors.forgotEmail) setErrors({});
                  }}
                  autoComplete="email"
                />
                {errors.forgotEmail && <span className="field-error"><AlertCircle size={12} />{errors.forgotEmail}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <span className="btn-spinner" /> : 'Send Reset Request'}
              </button>

              <p className="auth-switch-text">
                Remember your password?{' '}
                <button type="button" className="toggle-link" onClick={() => switchMode(MODES.LOGIN)}>
                  Sign In
                </button>
              </p>
            </form>
          </>
        )}

        {/* ── RESET PASSWORD ────────────────────────────────────────────── */}
        {mode === MODES.RESET && (
          <>
            <form className="auth-form" onSubmit={handleResetSubmit} noValidate>
              <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <div className="password-input-split">
                  <input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="New Password"
                    value={resetPasswordData.password}
                    onChange={handleChange(setResetPasswordData)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="field-error"><AlertCircle size={12} />{errors.password}</span>}
              </div>

              <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
                <div className="password-input-split">
                  <input
                    id="reset-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={resetPasswordData.confirmPassword}
                    onChange={handleChange(setResetPasswordData)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(p => !p)}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="field-error"><AlertCircle size={12} />{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <span className="btn-spinner" /> : 'Reset & Sign In'}
              </button>
            </form>
          </>
        )}

        {/* ── OTP VERIFICATION ─────────────────────────────────────────── */}
        {mode === MODES.VERIFY_OTP && (
          <>
            <form className="auth-form" onSubmit={handleVerifyOTPSubmit} noValidate>
              <h3 className="otp-modal-title">Verify security code</h3>
              <p className="otp-modal-subtitle">
                Enter the 6-digit code sent to <br />
                <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{otpEmail}</span>
              </p>

              {sandboxOtp && (
                <div className="sandbox-otp-banner">
                  <span className="sandbox-otp-icon">💡</span>
                  <div className="sandbox-otp-content">
                    <p className="sandbox-otp-title">Sandbox / Unverified Email Mode</p>
                    <p className="sandbox-otp-desc">
                      Since your email may not be verified in Resend, use this code: <strong>{sandboxOtp}</strong>
                    </p>
                  </div>
                </div>
              )}

              <div className={`form-group ${errors.otpValue ? 'has-error' : ''}`}>
                <input
                  id="otp-value"
                  type="text"
                  name="otpValue"
                  placeholder="0 0 0 0 0 0"
                  value={otpValue}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                    setOtpValue(cleaned);
                    if (errors.otpValue) setErrors({});
                  }}
                  maxLength={6}
                  style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px', fontWeight: 'bold' }}
                  autoComplete="one-time-code"
                />
                {errors.otpValue && <span className="field-error"><AlertCircle size={12} />{errors.otpValue}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading || otpValue.length < 6}>
                {isLoading ? <span className="btn-spinner" /> : 'Verify Code'}
              </button>

              <div className="otp-resend-wrapper">
                {cooldown > 0 ? (
                  <span className="otp-cooldown-text">Resend code in {cooldown}s</span>
                ) : (
                  <button type="button" className="otp-resend-link" onClick={handleResendOTPClick}>
                    Resend Code
                  </button>
                )}
              </div>

              <p className="auth-switch-text">
                <button type="button" className="toggle-link" onClick={() => switchMode(MODES.LOGIN)}>
                  Back to Log In
                </button>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
