import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  User, MapPin, ShoppingBag, Plus, Trash2, Calendar, Mail, Tag,
  Truck, ShieldAlert, ArrowLeft, Check, Clock, AlertTriangle, ArrowRight,
  Phone, KeyRound, Heart, Bell, ChevronRight, Edit3, Save, X, Eye, EyeOff
} from 'lucide-react';
import '../styles/Profile.css';

const Profile = () => {
  const {
    currentUser,
    fetchUserProfile,
    saveAddress,
    deleteAddress,
    fetchUserOrders,
    fetchOrderTracking,
    updateProfile,
    changePassword,
    favoriteItems,
    toggleFavorite,
    authLoading
  } = useApp();

  const navigate = useNavigate();
  const { trackOrderId } = useParams();

  // Active tab: 'profile', 'addresses', 'orders', 'track', 'password', 'wishlist', 'notifications'
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Tracking State
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', gender: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Change Password State
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [isSavingPw, setIsSavingPw] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  // Add Address Form States
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: 'Home', name: '', phone: '', address: '', city: '', state: '', zip: '', country: 'India'
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Redirect to home if not logged in
  useEffect(() => {
    if (!authLoading && !currentUser) navigate('/');
  }, [currentUser, authLoading, navigate]);

  // Populate profile form when user data loads
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        gender: currentUser.gender || ''
      });
    }
  }, [currentUser]);

  // Load orders when 'orders' tab is active
  useEffect(() => {
    if (currentUser && activeTab === 'orders') {
      const loadOrders = async () => {
        setOrdersLoading(true);
        const data = await fetchUserOrders();
        setOrders(data);
        setOrdersLoading(false);
      };
      loadOrders();
    }
  }, [currentUser, activeTab]);

  // Handle URL-based order tracking parameter
  useEffect(() => {
    if (trackOrderId && currentUser) handleTrackOrder(trackOrderId);
  }, [trackOrderId, currentUser]);

  const handleTrackOrder = async (orderId) => {
    setActiveTab('track');
    setTrackingLoading(true);
    setTrackingError('');
    setTrackingOrder(null);
    const order = await fetchOrderTracking(orderId);
    setTrackingLoading(false);
    if (order) {
      setTrackingOrder(order);
    } else {
      setTrackingError(`Order ${orderId} not found or you are not authorized to track it.`);
    }
  };

  // Profile Save
  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) return;
    setIsSavingProfile(true);
    const success = await updateProfile(profileForm);
    setIsSavingProfile(false);
    if (success) setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setProfileForm({ name: currentUser.name || '', phone: currentUser.phone || '', gender: currentUser.gender || '' });
    setIsEditingProfile(false);
  };

  // Change Password
  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm(prev => ({ ...prev, [name]: value }));
    if (pwErrors[name]) setPwErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validatePw = () => {
    const errs = {};
    if (!pwForm.currentPassword) errs.currentPassword = 'Current password is required';
    if (!pwForm.newPassword) errs.newPassword = 'New password is required';
    else if (pwForm.newPassword.length < 6) errs.newPassword = 'Must be at least 6 characters';
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setPwErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    if (!validatePw()) return;
    setIsSavingPw(true);
    const success = await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
    setIsSavingPw(false);
    if (success) setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Address handlers
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
    if (addressErrors[name]) setAddressErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateAddress = () => {
    const errs = {};
    if (!addressForm.name.trim()) errs.name = 'Full name is required';
    if (!addressForm.phone.trim()) errs.phone = 'Phone number is required';
    if (!addressForm.address.trim()) errs.address = 'Street address is required';
    if (!addressForm.city.trim()) errs.city = 'City is required';
    if (!addressForm.state.trim()) errs.state = 'State/Province is required';
    if (!addressForm.zip.trim()) errs.zip = 'ZIP/Postal code is required';
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddress()) return;
    setIsSavingAddress(true);
    const success = await saveAddress(addressForm);
    setIsSavingAddress(false);
    if (success) {
      setShowAddAddress(false);
      setAddressForm({ label: 'Home', name: '', phone: '', address: '', city: '', state: '', zip: '', country: 'India' });
      fetchUserProfile();
    }
  };

  const handleDeleteAddressClick = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(addressId);
      fetchUserProfile();
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="profile-loading-screen">
        <div className="premium-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const statusSteps = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const getStatusStepIndex = (status) => {
    let checkStatus = status;
    if (status === 'Pending') checkStatus = 'Placed';
    return statusSteps.indexOf(checkStatus);
  };

  const nameParts = currentUser.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
        <div className="profile-sidebar">

          {/* User Badge */}
          <div className="user-profile-badge-card">
            <div className="avatar-circle">{currentUser.name.charAt(0).toUpperCase()}</div>
            <div className="profile-badge-hello">Hello,</div>
            <h3 className="profile-badge-name">{currentUser.name}</h3>
            <span className="profile-badge-role">
              {currentUser.role === 'admin' ? 'Store Administrator' : 'eShop Member'}
            </span>
          </div>

          {/* Navigation Groups */}
          <div className="sidebar-nav-card">

            {/* MY ORDERS */}
            <div className="sidebar-nav-group">
              <button
                className={`sidebar-group-header-btn ${activeTab === 'orders' || activeTab === 'track' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <div className="sidebar-group-label">
                  <ShoppingBag size={16} />
                  MY ORDERS
                </div>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* ACCOUNT SETTINGS */}
            <div className="sidebar-nav-group">
              <div className="sidebar-group-title">
                <User size={14} />
                ACCOUNT SETTINGS
              </div>
              <button
                className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Information
              </button>
              <button
                className={`sidebar-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                Manage Addresses
              </button>
              <button
                className={`sidebar-nav-item ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                Change Password
              </button>
            </div>

            {/* MY STUFF */}
            <div className="sidebar-nav-group">
              <div className="sidebar-group-title">
                <Tag size={14} />
                MY STUFF
              </div>
              <button
                className={`sidebar-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                My Wishlist
                {favoriteItems.length > 0 && (
                  <span className="sidebar-badge">{favoriteItems.length}</span>
                )}
              </button>
              <button
                className={`sidebar-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                All Notifications
              </button>
            </div>

          </div>
        </div>

        {/* ── CONTENT PANEL ───────────────────────────────────────────── */}
        <div className="profile-content-card">

          {/* ── PROFILE INFO TAB ──────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="tab-fade-in">

              {/* Personal Information */}
              <div className="profile-section-block">
                <div className="profile-section-header">
                  <h2 className="profile-section-title">Personal Information</h2>
                  {!isEditingProfile ? (
                    <button className="profile-edit-btn" onClick={() => setIsEditingProfile(true)}>
                      <Edit3 size={14} /> Edit
                    </button>
                  ) : (
                    <div className="profile-edit-actions">
                      <button className="profile-cancel-btn" onClick={handleCancelEdit}>
                        <X size={14} /> Cancel
                      </button>
                      <button className="profile-save-btn" onClick={handleSaveProfile} disabled={isSavingProfile}>
                        <Save size={14} /> {isSavingProfile ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                {!isEditingProfile ? (
                  <div className="profile-info-display">
                    <div className="profile-name-row">
                      <div className="profile-info-field">
                        <span className="profile-info-label">First Name</span>
                        <span className="profile-info-value">{firstName || '—'}</span>
                      </div>
                      <div className="profile-info-field">
                        <span className="profile-info-label">Last Name</span>
                        <span className="profile-info-value">{lastName || '—'}</span>
                      </div>
                    </div>
                    <div className="profile-gender-row">
                      <span className="profile-info-label">Your Gender</span>
                      <div className="profile-gender-display">
                        <span className={`gender-radio-display ${currentUser.gender === 'Male' ? 'selected' : ''}`}>
                          <span className="radio-dot"></span> Male
                        </span>
                        <span className={`gender-radio-display ${currentUser.gender === 'Female' ? 'selected' : ''}`}>
                          <span className="radio-dot"></span> Female
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="profile-edit-form">
                    <div className="profile-name-row">
                      <div className="profile-form-group">
                        <label className="profile-form-label">First Name</label>
                        <input
                          type="text"
                          className="profile-form-input"
                          value={profileForm.name.split(' ')[0] || ''}
                          onChange={(e) => {
                            const rest = profileForm.name.split(' ').slice(1).join(' ');
                            setProfileForm(prev => ({ ...prev, name: e.target.value + (rest ? ' ' + rest : '') }));
                          }}
                          placeholder="First name"
                        />
                      </div>
                      <div className="profile-form-group">
                        <label className="profile-form-label">Last Name</label>
                        <input
                          type="text"
                          className="profile-form-input"
                          value={profileForm.name.split(' ').slice(1).join(' ') || ''}
                          onChange={(e) => {
                            const first = profileForm.name.split(' ')[0] || '';
                            setProfileForm(prev => ({ ...prev, name: first + (e.target.value ? ' ' + e.target.value : '') }));
                          }}
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                    <div className="profile-gender-edit-row">
                      <label className="profile-form-label">Your Gender</label>
                      <div className="profile-gender-options">
                        <label className="gender-radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={profileForm.gender === 'Male'}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))}
                          />
                          <span>Male</span>
                        </label>
                        <label className="gender-radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={profileForm.gender === 'Female'}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))}
                          />
                          <span>Female</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div className="profile-section-block">
                <div className="profile-section-header">
                  <h2 className="profile-section-title">Email Address</h2>
                </div>
                <div className="profile-readonly-field">
                  <Mail size={16} className="profile-field-icon" />
                  <span>{currentUser.email}</span>
                  <span className="profile-verified-badge">✓ Verified</span>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="profile-section-block">
                <div className="profile-section-header">
                  <h2 className="profile-section-title">Mobile Number</h2>
                  {!isEditingProfile && (
                    <button className="profile-edit-btn" onClick={() => setIsEditingProfile(true)}>
                      <Edit3 size={14} /> {currentUser.phone ? 'Edit' : 'Add'}
                    </button>
                  )}
                </div>
                {!isEditingProfile ? (
                  <div className="profile-readonly-field">
                    <Phone size={16} className="profile-field-icon" />
                    <span>{currentUser.phone || 'Not added yet'}</span>
                  </div>
                ) : (
                  <div className="profile-form-group" style={{ maxWidth: 300 }}>
                    <input
                      type="tel"
                      className="profile-form-input"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                    />
                  </div>
                )}
              </div>

              {/* Member info */}
              <div className="profile-section-block profile-meta-row">
                <div className="profile-meta-item">
                  <Calendar size={14} />
                  <span>Member since {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="profile-meta-item">
                  <Tag size={14} />
                  <span style={{ textTransform: 'capitalize' }}>{currentUser.role === 'admin' ? '🔑 Administrator' : '⭐ eShop Member'}</span>
                </div>
              </div>

              {/* FAQs */}
              <div className="profile-faq-section">
                <h3 className="profile-faq-title">FAQs</h3>
                <div className="profile-faq-item">
                  <h4>What happens when I update my name or mobile number?</h4>
                  <p>Your profile information updates immediately. This will reflect across all your orders and communications.</p>
                </div>
                <div className="profile-faq-item">
                  <h4>Can I change my email address?</h4>
                  <p>Email address is used for account verification and cannot be changed. Please contact support if needed.</p>
                </div>
                <div className="profile-faq-item">
                  <h4>Is my personal information safe?</h4>
                  <p>Yes, all your information is encrypted and securely stored. We never share your data with third parties.</p>
                </div>
              </div>

            </div>
          )}

          {/* ── SAVED ADDRESSES TAB ───────────────────────────────────── */}
          {activeTab === 'addresses' && (
            <div className="tab-fade-in">
              <div className="tab-header-row">
                <h2 className="tab-title">
                  <MapPin size={22} color="#ff7e5f" />
                  Manage Addresses
                </h2>
                {!showAddAddress && (
                  <button className="add-address-trigger-btn" onClick={() => setShowAddAddress(true)}>
                    <Plus size={16} /> Add New Address
                  </button>
                )}
              </div>

              {showAddAddress && (
                <form className="add-address-form-box" onSubmit={handleAddAddressSubmit}>
                  <h4 className="form-box-title">Add New Address</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Address Label</label>
                      <select name="label" value={addressForm.label} onChange={handleAddressChange} className="form-control">
                        <option value="Home">🏠 Home</option>
                        <option value="Office">🏢 Office</option>
                        <option value="Work">💼 Work</option>
                        <option value="Other">📍 Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Full Recipient Name *</label>
                      <input type="text" name="name" value={addressForm.name} onChange={handleAddressChange}
                        className={`form-control ${addressErrors.name ? 'error' : ''}`} placeholder="John Doe" />
                      {addressErrors.name && <span className="error-message">{addressErrors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label>Contact Phone *</label>
                      <input type="text" name="phone" value={addressForm.phone} onChange={handleAddressChange}
                        className={`form-control ${addressErrors.phone ? 'error' : ''}`} placeholder="+91 9876543210" />
                      {addressErrors.phone && <span className="error-message">{addressErrors.phone}</span>}
                    </div>
                    <div className="form-group full-width">
                      <label>Street Address *</label>
                      <input type="text" name="address" value={addressForm.address} onChange={handleAddressChange}
                        className={`form-control ${addressErrors.address ? 'error' : ''}`} placeholder="Flat, Apartment, Street" />
                      {addressErrors.address && <span className="error-message">{addressErrors.address}</span>}
                    </div>
                    <div className="form-group">
                      <label>City *</label>
                      <input type="text" name="city" value={addressForm.city} onChange={handleAddressChange}
                        className={`form-control ${addressErrors.city ? 'error' : ''}`} placeholder="Kolkata" />
                      {addressErrors.city && <span className="error-message">{addressErrors.city}</span>}
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input type="text" name="state" value={addressForm.state} onChange={handleAddressChange}
                        className={`form-control ${addressErrors.state ? 'error' : ''}`} placeholder="West Bengal" />
                      {addressErrors.state && <span className="error-message">{addressErrors.state}</span>}
                    </div>
                    <div className="form-group">
                      <label>ZIP / Postal Code *</label>
                      <input type="text" name="zip" value={addressForm.zip} onChange={handleAddressChange}
                        className={`form-control ${addressErrors.zip ? 'error' : ''}`} placeholder="700001" />
                      {addressErrors.zip && <span className="error-message">{addressErrors.zip}</span>}
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input type="text" name="country" value={addressForm.country} onChange={handleAddressChange}
                        className="form-control" disabled />
                    </div>
                  </div>
                  <div className="form-actions-row">
                    <button type="button" className="address-cancel-btn" onClick={() => setShowAddAddress(false)} disabled={isSavingAddress}>
                      Cancel
                    </button>
                    <button type="submit" className="address-save-submit-btn" disabled={isSavingAddress}>
                      {isSavingAddress ? 'Saving...' : 'Save Address'}
                    </button>
                  </div>
                </form>
              )}

              {!currentUser.savedAddresses || currentUser.savedAddresses.length === 0 ? (
                <div className="empty-addresses-state">
                  <MapPin size={48} className="empty-icon" />
                  <h3>No saved addresses yet</h3>
                  <p>Add your delivery address to speed up checkout.</p>
                  <button className="empty-add-address-btn" onClick={() => setShowAddAddress(true)}>
                    <Plus size={16} /> Add First Address
                  </button>
                </div>
              ) : (
                <div className="saved-addresses-grid-list">
                  {currentUser.savedAddresses.map((addr) => (
                    <div className="address-profile-card" key={addr._id}>
                      <div className="address-profile-header">
                        <span className="address-profile-label">
                          {addr.label === 'Home' ? '🏠 ' : addr.label === 'Office' ? '🏢 ' : addr.label === 'Work' ? '💼 ' : '📍 '}
                          {addr.label}
                        </span>
                        <button className="address-delete-action-btn" onClick={() => handleDeleteAddressClick(addr._id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h4 className="address-recipient-name">{addr.name}</h4>
                      <p className="address-phone-number">📞 {addr.phone}</p>
                      <div className="address-details-body">
                        <p>{addr.address}</p>
                        <p>{addr.city}, {addr.state} - {addr.zip}</p>
                        <p>{addr.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CHANGE PASSWORD TAB ────────────────────────────────────── */}
          {activeTab === 'password' && (
            <div className="tab-fade-in">
              <h2 className="tab-title">
                <KeyRound size={22} color="#ff7e5f" />
                Change Password
              </h2>

              {currentUser.googleId && !currentUser.password ? (
                <div className="pw-google-notice">
                  <ShieldAlert size={32} className="pw-google-icon" />
                  <h3>Google Account</h3>
                  <p>You signed in with Google. Password change is not available for Google-linked accounts.</p>
                </div>
              ) : (
                <form className="pw-change-form" onSubmit={handleChangePw}>
                  <div className="pw-form-group">
                    <label className="pw-form-label">Current Password</label>
                    <div className="pw-input-wrapper">
                      <input
                        type={showPw.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={pwForm.currentPassword}
                        onChange={handlePwChange}
                        className={`pw-form-input ${pwErrors.currentPassword ? 'error' : ''}`}
                        placeholder="Enter current password"
                      />
                      <button type="button" className="pw-toggle-btn" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}>
                        {showPw.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors.currentPassword && <span className="pw-error">{pwErrors.currentPassword}</span>}
                  </div>

                  <div className="pw-form-group">
                    <label className="pw-form-label">New Password</label>
                    <div className="pw-input-wrapper">
                      <input
                        type={showPw.new ? 'text' : 'password'}
                        name="newPassword"
                        value={pwForm.newPassword}
                        onChange={handlePwChange}
                        className={`pw-form-input ${pwErrors.newPassword ? 'error' : ''}`}
                        placeholder="Enter new password (min 6 chars)"
                      />
                      <button type="button" className="pw-toggle-btn" onClick={() => setShowPw(p => ({ ...p, new: !p.new }))}>
                        {showPw.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors.newPassword && <span className="pw-error">{pwErrors.newPassword}</span>}
                    {/* Password strength indicator */}
                    {pwForm.newPassword && (
                      <div className="pw-strength-bar">
                        <div className={`pw-strength-fill strength-${
                          pwForm.newPassword.length >= 10 && /[A-Z]/.test(pwForm.newPassword) && /[0-9]/.test(pwForm.newPassword) ? 'strong' :
                          pwForm.newPassword.length >= 6 ? 'medium' : 'weak'
                        }`}></div>
                        <span className="pw-strength-label">
                          {pwForm.newPassword.length >= 10 && /[A-Z]/.test(pwForm.newPassword) && /[0-9]/.test(pwForm.newPassword) ? 'Strong' :
                           pwForm.newPassword.length >= 6 ? 'Medium' : 'Weak'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pw-form-group">
                    <label className="pw-form-label">Confirm New Password</label>
                    <div className="pw-input-wrapper">
                      <input
                        type={showPw.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={pwForm.confirmPassword}
                        onChange={handlePwChange}
                        className={`pw-form-input ${pwErrors.confirmPassword ? 'error' : ''}`}
                        placeholder="Re-enter new password"
                      />
                      <button type="button" className="pw-toggle-btn" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}>
                        {showPw.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {pwErrors.confirmPassword && <span className="pw-error">{pwErrors.confirmPassword}</span>}
                    {pwForm.confirmPassword && pwForm.newPassword === pwForm.confirmPassword && !pwErrors.confirmPassword && (
                      <span className="pw-match-ok"><Check size={13} /> Passwords match</span>
                    )}
                  </div>

                  <div className="pw-tips-box">
                    <h4 className="pw-tips-title">Password Tips</h4>
                    <ul className="pw-tips-list">
                      <li>Use at least 6 characters</li>
                      <li>Mix uppercase, lowercase, numbers</li>
                      <li>Avoid common words or sequences</li>
                    </ul>
                  </div>

                  <button type="submit" className="pw-submit-btn" disabled={isSavingPw}>
                    <KeyRound size={16} />
                    {isSavingPw ? 'Changing Password...' : 'Change Password'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ── MY WISHLIST TAB ────────────────────────────────────────── */}
          {activeTab === 'wishlist' && (
            <div className="tab-fade-in">
              <h2 className="tab-title">
                <Heart size={22} color="#ff7e5f" />
                My Wishlist
              </h2>

              {favoriteItems.length === 0 ? (
                <div className="empty-addresses-state">
                  <Heart size={48} className="empty-icon" />
                  <h3>Your wishlist is empty</h3>
                  <p>Save items you love to buy them later!</p>
                  <button className="empty-add-address-btn" onClick={() => navigate('/')}>
                    Explore Products <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {favoriteItems.map((item) => (
                    <div className="wishlist-card" key={item._id || item.id}>
                      <div className="wishlist-card-img-wrap" onClick={() => navigate(`/product/${item._id || item.id}`)}>
                        <img src={item.image || item.img} alt={item.title || item.name} className="wishlist-card-img" />
                      </div>
                      <div className="wishlist-card-body">
                        <h4 className="wishlist-card-name" onClick={() => navigate(`/product/${item._id || item.id}`)}>
                          {item.title || item.name}
                        </h4>
                        <div className="wishlist-card-price-row">
                          <span className="wishlist-card-price">
                            ₹{(item.price || item.salePrice || 0).toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className="wishlist-card-original">₹{item.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        <div className="wishlist-card-actions">
                          <button
                            className="wishlist-view-btn"
                            onClick={() => navigate(`/product/${item._id || item.id}`)}
                          >
                            View Product
                          </button>
                          <button
                            className="wishlist-remove-btn"
                            onClick={() => toggleFavorite(item)}
                            title="Remove from wishlist"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── NOTIFICATIONS TAB (placeholder) ───────────────────────── */}
          {activeTab === 'notifications' && (
            <div className="tab-fade-in">
              <h2 className="tab-title">
                <Bell size={22} color="#ff7e5f" />
                All Notifications
              </h2>
              <div className="empty-addresses-state">
                <Bell size={48} className="empty-icon" />
                <h3>No notifications yet</h3>
                <p>Order updates, offers and alerts will appear here.</p>
              </div>
            </div>
          )}

          {/* ── ORDER HISTORY TAB ─────────────────────────────────────── */}
          {activeTab === 'orders' && (
            <div className="tab-fade-in">
              <h2 className="tab-title">
                <ShoppingBag size={22} color="#ff7e5f" />
                My Orders
              </h2>

              {ordersLoading ? (
                <div className="tab-sub-loader">
                  <div className="premium-spinner"></div>
                  <p>Fetching your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-addresses-state">
                  <ShoppingBag size={48} className="empty-icon" />
                  <h3>No orders placed yet</h3>
                  <p>Start shopping to fill your order history!</p>
                  <button className="empty-add-address-btn" onClick={() => navigate('/')}>
                    Start Shopping <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="order-history-list">
                  {orders.map((order) => (
                    <div className="order-history-card" key={order.orderId}>
                      <div className="order-card-top-summary">
                        <div className="order-card-meta">
                          <span className="order-history-id">Order ID: <strong>{order.orderId}</strong></span>
                          <span className="order-history-date">
                            Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="order-status-badge-row">
                          <span className={`order-status-badge status-${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                            {order.status}
                          </span>
                          <button className="track-order-action-btn" onClick={() => handleTrackOrder(order.orderId)}>
                            <Truck size={14} /> Track Order
                          </button>
                        </div>
                      </div>
                      <div className="order-card-items-preview">
                        {order.items.map((item, idx) => (
                          <div className="order-preview-item" key={idx}>
                            <img src={item.image} alt={item.title} className="order-preview-img" />
                            <div className="order-preview-info">
                              <h5 className="order-preview-name">{item.title}</h5>
                              <span className="order-preview-qty-price">Qty: {item.quantity} × ₹{item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="order-card-footer-billing">
                        <span>Total Amount:</span>
                        <strong className="order-footer-total">₹{order.total.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ORDER TRACKING TAB ────────────────────────────────────── */}
          {activeTab === 'track' && (
            <div className="tab-fade-in">
              <div className="track-back-row">
                <button className="track-back-btn" onClick={() => setActiveTab('orders')}>
                  <ArrowLeft size={16} /> Back to Orders
                </button>
              </div>

              {trackingLoading ? (
                <div className="tab-sub-loader">
                  <div className="premium-spinner"></div>
                  <p>Fetching tracking details...</p>
                </div>
              ) : trackingError ? (
                <div className="tracking-error-card">
                  <AlertTriangle size={36} color="#ef4444" />
                  <h4>Tracking Failed</h4>
                  <p>{trackingError}</p>
                </div>
              ) : trackingOrder ? (
                <div className="order-tracking-card-view">
                  <div className="tracking-header-card">
                    <div className="tracking-header-meta">
                      <h3>Tracking Order: <strong>{trackingOrder.orderId}</strong></h3>
                      <p>Estimated Delivery: <strong>
                        {new Date(trackingOrder.estimatedDelivery).toLocaleDateString('en-US', {
                          weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </strong></p>
                    </div>
                    <span className={`order-status-badge status-${trackingOrder.status.toLowerCase().replace(/\s/g, '-')}`} style={{ fontSize: '14px', padding: '6px 16px' }}>
                      {trackingOrder.status}
                    </span>
                  </div>

                  <div className="visual-timeline-progress-stepper">
                    <div className="timeline-connector-bar">
                      <div className="timeline-connector-bar-progress" style={{ width: `${(getStatusStepIndex(trackingOrder.status) / (statusSteps.length - 1)) * 100}%` }}></div>
                    </div>
                    {statusSteps.map((stepName, index) => {
                      const isActive = trackingOrder.status === stepName;
                      const isCompleted = getStatusStepIndex(trackingOrder.status) >= index;
                      return (
                        <div key={index} className={`timeline-step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                          <div className="timeline-step-circle">
                            {isCompleted && !isActive ? <Check size={14} /> : index + 1}
                          </div>
                          <span className="timeline-step-label">{stepName}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="logistics-tracking-logs-card">
                    <h4 className="logs-card-title"><Clock size={16} /> Real-time Logistics Log</h4>
                    <div className="logistics-timeline-logs-list">
                      {trackingOrder.statusLog.slice().reverse().map((log, idx) => (
                        <div className="logistics-log-row" key={idx}>
                          <div className="log-row-timestamp-column">
                            <span className="log-time">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="log-date">{new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="log-row-status-bullet-column">
                            <div className={`log-bullet ${idx === 0 ? 'pulse-bullet' : ''}`}></div>
                          </div>
                          <div className="log-row-details-column">
                            <h5 className="log-status-tag">{log.status}</h5>
                            <p className="log-status-message">{log.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="tracking-shipping-details-card">
                    <h4 className="logs-card-title"><MapPin size={16} /> Delivering to</h4>
                    <div className="tracking-shipping-address-summary">
                      <p><strong>{trackingOrder.shippingAddress.name}</strong></p>
                      <p>{trackingOrder.shippingAddress.address}</p>
                      <p>{trackingOrder.shippingAddress.city}, {trackingOrder.shippingAddress.state} - {trackingOrder.shippingAddress.zip}</p>
                      <p>{trackingOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
