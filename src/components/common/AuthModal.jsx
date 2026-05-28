import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import '../../styles/AuthModal.css';

const MODES = { LOGIN: 'login', SIGNUP: 'signup', FORGOT: 'forgot' };

const AuthModal = ({ isOpen, onClose, initialMode = 'login', onLogin }) => {
  const [mode, setMode] = useState(initialMode);
  const [activeTab, setActiveTab] = useState('email'); // for signup: 'phone' or 'email'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Form fields
  const [loginData, setLoginData] = useState({ identifier: '', password: '', remember: false });
  const [signupData, setSignupData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [forgotEmail, setForgotEmail] = useState('');

  // Validation errors
  const [errors, setErrors] = useState({});

  // Reset when reopened
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrors({});
      setIsLoading(false);
      setForgotSuccess(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // ── Validation helpers ───────────────────────────────────────────────────
  const validateLogin = () => {
    const errs = {};
    if (!loginData.identifier.trim()) errs.identifier = 'Email or username is required';
    if (!loginData.password.trim()) errs.password = 'Password is required';
    return errs;
  };

  const validateSignup = () => {
    const errs = {};
    if (!signupData.name.trim()) errs.name = 'Full name is required';
    if (!signupData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errs.email = 'Invalid email address';
    }
    if (!signupData.password) {
      errs.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (signupData.password !== signupData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  // ── Submit handlers ──────────────────────────────────────────────────────
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    setTimeout(() => {
      if (onLogin) {
        const isAdmin = loginData.identifier.toLowerCase().includes('admin');
        onLogin({
          name: isAdmin ? 'Store Owner' : 'John Customer',
          email: isAdmin ? 'admin@eshop.com' : 'customer@eshop.com',
          role: isAdmin ? 'admin' : 'customer',
        });
      }
      setLoginData({ identifier: '', password: '', remember: false });
      setIsLoading(false);
      onClose();
    }, 800);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const errs = validateSignup();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    setTimeout(() => {
      if (onLogin) {
        onLogin({ name: signupData.name, email: signupData.email, role: 'customer' });
      }
      setSignupData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
      setIsLoading(false);
      onClose();
    }, 800);
  };
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setErrors({ forgotEmail: 'Please enter a valid email address' });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSuccess(true);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (onLogin) {
        onLogin({
          name: 'Google User',
          email: 'user@gmail.com',
          role: 'customer'
        });
      }
      setIsLoading(false);
      onClose();
    }, 800);
  };

  const handleChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setIsLoading(false);
    setForgotSuccess(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* ── LOGIN ─────────────────────────────────────────────────────── */}
        {mode === MODES.LOGIN && (
          <>
            <div className="modal-header">
              <div className="modal-logo">
                <span className="logo-icon">e</span>
                <span className="logo-text">Shop</span>
              </div>
              <h2>Welcome Back!</h2>
              <p>Sign in to access your account, orders, and wishlist.</p>
            </div>

            <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
              <div className={`form-group ${errors.identifier ? 'has-error' : ''}`}>
                <label htmlFor="auth-identifier">
                  <User size={14} /> Email or Username
                </label>
                <input
                  id="auth-identifier"
                  type="text"
                  name="identifier"
                  placeholder="your@email.com or 'admin'"
                  value={loginData.identifier}
                  onChange={handleChange(setLoginData)}
                  autoComplete="username"
                />
                {errors.identifier && <span className="field-error"><AlertCircle size={12} />{errors.identifier}</span>}
              </div>

              <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <label htmlFor="auth-password">
                  <Lock size={14} /> Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleChange(setLoginData)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="field-error"><AlertCircle size={12} />{errors.password}</span>}
              </div>

              <div className="form-row-flex">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={loginData.remember}
                    onChange={handleChange(setLoginData)}
                  />
                  Remember me
                </label>
                <button type="button" className="forgot-link" onClick={() => switchMode(MODES.FORGOT)}>
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="submit-btn primary" disabled={isLoading}>
                {isLoading ? <span className="btn-spinner" /> : 'Sign In'}
              </button>

              <div className="auth-divider"><span>or continue with</span></div>

              <button 
                type="button" 
                className="social-login-btn google-btn" 
                onClick={handleGoogleLogin} 
                disabled={isLoading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="auth-switch-text">
                Don't have an account?{' '}
                <button type="button" className="toggle-link" onClick={() => switchMode(MODES.SIGNUP)}>
                  Sign up for free
                </button>
              </p>
            </form>
          </>
        )}

        {/* ── SIGNUP ────────────────────────────────────────────────────── */}
        {mode === MODES.SIGNUP && (
          <>
            <div className="modal-header">
              <div className="modal-logo">
                <span className="logo-icon">e</span>
                <span className="logo-text">Shop</span>
              </div>
              <h2>Create Account</h2>
              <p>Join thousands of happy shoppers. Takes less than a minute!</p>
            </div>

            <form className="auth-form" onSubmit={handleSignupSubmit} noValidate>
              <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                <label htmlFor="signup-name"><User size={14} /> Full Name</label>
                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={signupData.name}
                  onChange={handleChange(setSignupData)}
                  autoComplete="name"
                />
                {errors.name && <span className="field-error"><AlertCircle size={12} />{errors.name}</span>}
              </div>

              <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="signup-email"><Mail size={14} /> Email Address</label>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={signupData.email}
                  onChange={handleChange(setSignupData)}
                  autoComplete="email"
                />
                {errors.email && <span className="field-error"><AlertCircle size={12} />{errors.email}</span>}
              </div>

              <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                <label htmlFor="signup-password"><Lock size={14} /> Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="At least 6 characters"
                    value={signupData.password}
                    onChange={handleChange(setSignupData)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="field-error"><AlertCircle size={12} />{errors.password}</span>}
              </div>

              <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
                <label htmlFor="signup-confirm"><Lock size={14} /> Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="signup-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    value={signupData.confirmPassword}
                    onChange={handleChange(setSignupData)}
                    autoComplete="new-password"
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(p => !p)}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="field-error"><AlertCircle size={12} />{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="submit-btn primary" disabled={isLoading}>
                {isLoading ? <span className="btn-spinner" /> : 'Create Account'}
              </button>

              <p className="auth-switch-text">
                Already have an account?{' '}
                <button type="button" className="toggle-link" onClick={() => switchMode(MODES.LOGIN)}>
                  Sign In
                </button>
              </p>
            </form>
          </>
        )}

        {/* ── FORGOT PASSWORD ───────────────────────────────────────────── */}
        {mode === MODES.FORGOT && (
          <>
            <div className="modal-header">
              <div className="modal-logo">
                <span className="logo-icon">e</span>
                <span className="logo-text">Shop</span>
              </div>
              <h2>Reset Password</h2>
              <p>Enter your email and we'll send you a reset link.</p>
            </div>

            {forgotSuccess ? (
              <div className="forgot-success-state">
                <div className="forgot-success-icon">✉️</div>
                <h3>Check your inbox!</h3>
                <p>We sent a password reset link to <strong>{forgotEmail}</strong>.</p>
                <button type="button" className="submit-btn primary" onClick={() => switchMode(MODES.LOGIN)}>
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleForgotSubmit} noValidate>
                <div className={`form-group ${errors.forgotEmail ? 'has-error' : ''}`}>
                  <label htmlFor="forgot-email"><Mail size={14} /> Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    name="forgotEmail"
                    placeholder="your@email.com"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (errors.forgotEmail) setErrors({});
                    }}
                    autoComplete="email"
                  />
                  {errors.forgotEmail && <span className="field-error"><AlertCircle size={12} />{errors.forgotEmail}</span>}
                </div>

                <button type="submit" className="submit-btn primary" disabled={isLoading}>
                  {isLoading ? <span className="btn-spinner" /> : 'Send Reset Link'}
                </button>

                <p className="auth-switch-text">
                  Remember your password?{' '}
                  <button type="button" className="toggle-link" onClick={() => switchMode(MODES.LOGIN)}>
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
