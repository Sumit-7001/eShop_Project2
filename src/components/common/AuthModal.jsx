import React, { useState } from 'react';
import { X, Phone, Mail, ChevronDown, Eye, EyeOff } from 'lucide-react';
import '../../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [activeTab, setActiveTab] = useState('phone'); // for signup
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {mode === 'login' ? (
          /* LOGIN MODE */
          <>
            <div className="modal-header">
              <h2>Welcome Back</h2>
              <p>Fill your email or mobile and password to sign in.</p>
            </div>

            <form className="auth-form">
              <div className="form-group">
                <label>Email or Mobile Number</label>
                <input type="text" placeholder="9874565677" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="........" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                <button type="submit" className="submit-btn primary">Sign In</button>
              </div>

              <div className="auth-links">
                <a href="#" className="forgot-link">Forgot Password ?</a>
                <p>Don't have an account? <span className="toggle-link" onClick={() => setMode('signup')}>Sign up Here</span></p>
              </div>
            </form>
          </>
        ) : (
          /* SIGNUP MODE */
          <>
            <div className="modal-header">
              <h2>Sign up Here</h2>
              <p>Registration takes less than a minute.</p>
            </div>

            <div className="tab-buttons">
              <button 
                className={`tab-btn ${activeTab === 'phone' ? 'active' : ''}`}
                onClick={() => setActiveTab('phone')}
              >
                <Phone size={18} /> Phone
              </button>
              <button 
                className={`tab-btn ${activeTab === 'email' ? 'active' : ''}`}
                onClick={() => setActiveTab('email')}
              >
                <Mail size={18} /> Email
              </button>
            </div>

            <form className="auth-form">
              {activeTab === 'phone' ? (
                <div className="input-group phone-input">
                  <div className="country-code">
                    <img src="https://flagcdn.com/w20/in.png" alt="India" />
                    <span>+91</span>
                    <ChevronDown size={14} />
                  </div>
                  <input type="tel" placeholder="Enter Mobile Number" required />
                </div>
              ) : (
                <div className="form-group">
                  <input type="email" placeholder="Enter Email Address" required />
                </div>
              )}

              <div className="captcha-placeholder">
                <div className="captcha-box">
                  <div className="captcha-left">
                    <input type="checkbox" id="robot" />
                    <label htmlFor="robot">I'm not a robot</label>
                  </div>
                  <div className="captcha-right">
                    <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" />
                    <span>reCAPTCHA</span>
                    <div className="captcha-links">
                      <a href="#">Privacy</a> - <a href="#">Terms</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                <button type="submit" className="submit-btn primary">Send OTP</button>
              </div>

              <div className="auth-links">
                <p>Already have an account? <span className="toggle-link" onClick={() => setMode('login')}>Sign In</span></p>
              </div>
            </form>
          </>
        )}

        <div className="modal-footer">
          <div className="divider"><span>or</span></div>
          <button className="social-login-btn">
            G
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
