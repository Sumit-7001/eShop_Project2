import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, MapPin, ShoppingBag, Plus, Trash2, Calendar, Mail, Tag, Truck, ShieldAlert, ArrowLeft, Check, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import '../styles/Profile.css';

const Profile = () => {
  const { 
    currentUser, 
    fetchUserProfile, 
    saveAddress, 
    deleteAddress, 
    fetchUserOrders, 
    fetchOrderTracking,
    authLoading 
  } = useApp();
  
  const navigate = useNavigate();
  const { trackOrderId } = useParams();

  // Tabs: 'profile', 'addresses', 'orders', 'track'
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  // Tracking State
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Add Address Form States
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Redirect to home if user is not logged in after auth finishes loading
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/');
    }
  }, [currentUser, authLoading, navigate]);

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
    if (trackOrderId && currentUser) {
      handleTrackOrder(trackOrderId);
    }
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

  // Address Input Handlers
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
    if (addressErrors[name]) {
      setAddressErrors(prev => ({ ...prev, [name]: '' }));
    }
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
      setAddressForm({
        label: 'Home',
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'India'
      });
      // Force refresh user profile
      fetchUserProfile();
    }
  };

  const handleDeleteAddressClick = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this shipping address?')) {
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

  // Tracking Progress Mapping
  const statusSteps = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const getStatusStepIndex = (status) => {
    let checkStatus = status;
    if (status === 'Pending') checkStatus = 'Placed';
    return statusSteps.indexOf(checkStatus);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Navigation Sidebar Card */}
        <div className="profile-sidebar">
          <div className="user-profile-badge-card">
            <div className="avatar-circle">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="profile-badge-name">{currentUser.name}</h3>
            <span className="profile-badge-role">{currentUser.role === 'admin' ? 'Store Administrator' : 'eShop VIP Member'}</span>
          </div>

          <div className="sidebar-navigation-menu">
            <button 
              className={`menu-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} /> My Account Info
            </button>
            
            <button 
              className={`menu-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <MapPin size={18} /> Saved Addresses
            </button>

            <button 
              className={`menu-nav-item ${activeTab === 'orders' || activeTab === 'track' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} /> My Order History
            </button>
          </div>
        </div>

        {/* Content Details Dashboard */}
        <div className="profile-content-card">
          
          {/* ── PROFILE INFO TAB ─────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="tab-fade-in">
              <h2 className="tab-title">
                <User size={22} color="#ff7e5f" />
                Account Information
              </h2>
              
              <div className="profile-details-grid">
                <div className="detail-field-card">
                  <div className="detail-card-icon"><User size={20} /></div>
                  <div className="detail-card-info">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{currentUser.name}</span>
                  </div>
                </div>

                <div className="detail-field-card">
                  <div className="detail-card-icon"><Mail size={20} /></div>
                  <div className="detail-card-info">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">{currentUser.email}</span>
                  </div>
                </div>

                <div className="detail-field-card">
                  <div className="detail-card-icon"><Tag size={20} /></div>
                  <div className="detail-card-info">
                    <span className="detail-label">Account Privilege</span>
                    <span className="detail-value" style={{ textTransform: 'capitalize' }}>{currentUser.role}</span>
                  </div>
                </div>

                <div className="detail-field-card">
                  <div className="detail-card-icon"><Calendar size={20} /></div>
                  <div className="detail-card-info">
                    <span className="detail-label">Member Since</span>
                    <span className="detail-value">
                      {new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SAVED ADDRESSES TAB ─────────────────────────────────────────── */}
          {activeTab === 'addresses' && (
            <div className="tab-fade-in">
              <div className="tab-header-row">
                <h2 className="tab-title">
                  <MapPin size={22} color="#ff7e5f" />
                  Saved Shipping Addresses
                </h2>
                {!showAddAddress && (
                  <button 
                    className="add-address-trigger-btn"
                    onClick={() => setShowAddAddress(true)}
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                )}
              </div>

              {/* Add Address Form Accordion Slide-Down */}
              {showAddAddress && (
                <form className="add-address-form-box" onSubmit={handleAddAddressSubmit}>
                  <h4 className="form-box-title">Add New Address Profile</h4>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Address Label (e.g. Home, Office, Work)</label>
                      <select 
                        name="label" 
                        value={addressForm.label}
                        onChange={handleAddressChange}
                        className="form-control"
                      >
                        <option value="Home">🏠 Home</option>
                        <option value="Office">🏢 Office</option>
                        <option value="Work">💼 Work</option>
                        <option value="Other">📍 Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Full Recipient Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={addressForm.name}
                        onChange={handleAddressChange}
                        className={`form-control ${addressErrors.name ? 'error' : ''}`}
                        placeholder="John Doe"
                      />
                      {addressErrors.name && <span className="error-message">{addressErrors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label>Contact Phone Number *</label>
                      <input 
                        type="text" 
                        name="phone" 
                        value={addressForm.phone}
                        onChange={handleAddressChange}
                        className={`form-control ${addressErrors.phone ? 'error' : ''}`}
                        placeholder="+91 9876543210"
                      />
                      {addressErrors.phone && <span className="error-message">{addressErrors.phone}</span>}
                    </div>

                    <div className="form-group full-width">
                      <label>Street Address Details *</label>
                      <input 
                        type="text" 
                        name="address" 
                        value={addressForm.address}
                        onChange={handleAddressChange}
                        className={`form-control ${addressErrors.address ? 'error' : ''}`}
                        placeholder="Flat No, Apartment, Sector, Street address"
                      />
                      {addressErrors.address && <span className="error-message">{addressErrors.address}</span>}
                    </div>

                    <div className="form-group">
                      <label>City / Town *</label>
                      <input 
                        type="text" 
                        name="city" 
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        className={`form-control ${addressErrors.city ? 'error' : ''}`}
                        placeholder="Kolkata"
                      />
                      {addressErrors.city && <span className="error-message">{addressErrors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label>State / Province *</label>
                      <input 
                        type="text" 
                        name="state" 
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        className={`form-control ${addressErrors.state ? 'error' : ''}`}
                        placeholder="West Bengal"
                      />
                      {addressErrors.state && <span className="error-message">{addressErrors.state}</span>}
                    </div>

                    <div className="form-group">
                      <label>ZIP / Postal Code *</label>
                      <input 
                        type="text" 
                        name="zip" 
                        value={addressForm.zip}
                        onChange={handleAddressChange}
                        className={`form-control ${addressErrors.zip ? 'error' : ''}`}
                        placeholder="700001"
                      />
                      {addressErrors.zip && <span className="error-message">{addressErrors.zip}</span>}
                    </div>

                    <div className="form-group">
                      <label>Country *</label>
                      <input 
                        type="text" 
                        name="country" 
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        className="form-control"
                        placeholder="India"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-actions-row">
                    <button 
                      type="button" 
                      className="address-cancel-btn"
                      onClick={() => setShowAddAddress(false)}
                      disabled={isSavingAddress}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="address-save-submit-btn"
                      disabled={isSavingAddress}
                    >
                      {isSavingAddress ? 'Saving Address...' : 'Save Shipping Address'}
                    </button>
                  </div>
                </form>
              )}

              {/* Render Saved Address Cards */}
              {!currentUser.savedAddresses || currentUser.savedAddresses.length === 0 ? (
                <div className="empty-addresses-state">
                  <MapPin size={48} className="empty-icon" />
                  <h3>No saved addresses found</h3>
                  <p>Save shipping addresses now to select them instantly during checkout!</p>
                  <button className="empty-add-address-btn" onClick={() => setShowAddAddress(true)}>
                    <Plus size={16} /> Add Your First Address
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
                        <button 
                          className="address-delete-action-btn"
                          onClick={() => handleDeleteAddressClick(addr._id)}
                          title="Delete address"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <h4 className="address-recipient-name">{addr.name}</h4>
                      <p className="address-phone-number">📞 Phone: {addr.phone}</p>
                      
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

          {/* ── ORDER HISTORY TAB ─────────────────────────────────────────── */}
          {activeTab === 'orders' && (
            <div className="tab-fade-in">
              <h2 className="tab-title">
                <ShoppingBag size={22} color="#ff7e5f" />
                My Order History
              </h2>

              {ordersLoading ? (
                <div className="tab-sub-loader">
                  <div className="premium-spinner"></div>
                  <p>Fetching your past orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-addresses-state">
                  <ShoppingBag size={48} className="empty-icon" />
                  <h3>No orders placed yet</h3>
                  <p>You haven't bought any premium goods yet. Start shopping to fill your history!</p>
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
                            Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="order-status-badge-row">
                          <span className={`order-status-badge status-${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                            {order.status}
                          </span>
                          <button 
                            className="track-order-action-btn"
                            onClick={() => handleTrackOrder(order.orderId)}
                          >
                            <Truck size={14} /> Track Order
                          </button>
                        </div>
                      </div>

                      {/* Items Ordered List inside history card */}
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
                        <span>Total Invoice Amount:</span>
                        <strong className="order-footer-total">₹{order.total.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── HIGH FIDELITY ORDER TRACKING TAB ───────────────────────────── */}
          {activeTab === 'track' && (
            <div className="tab-fade-in">
              <div className="track-back-row">
                <button className="track-back-btn" onClick={() => setActiveTab('orders')}>
                  <ArrowLeft size={16} /> Back to History
                </button>
              </div>

              {trackingLoading ? (
                <div className="tab-sub-loader">
                  <div className="premium-spinner"></div>
                  <p>Fetching real-time tracking parameters...</p>
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
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </strong></p>
                    </div>
                    <span className={`order-status-badge status-${trackingOrder.status.toLowerCase().replace(/\s/g, '-')}`} style={{ fontSize: '14px', padding: '6px 16px' }}>
                      Status: {trackingOrder.status}
                    </span>
                  </div>

                  {/* HIGH FIDELITY STEPS TIMELINE PROGRESS BAR */}
                  <div className="visual-timeline-progress-stepper">
                    <div className="timeline-connector-bar">
                      <div 
                        className="timeline-connector-bar-progress"
                        style={{
                          width: `${(getStatusStepIndex(trackingOrder.status) / (statusSteps.length - 1)) * 100}%`
                        }}
                      ></div>
                    </div>

                    {statusSteps.map((stepName, index) => {
                      const isActive = trackingOrder.status === stepName;
                      const isCompleted = getStatusStepIndex(trackingOrder.status) >= index;
                      
                      return (
                        <div 
                          key={index} 
                          className={`timeline-step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        >
                          <div className="timeline-step-circle">
                            {isCompleted && !isActive ? <Check size={14} /> : index + 1}
                          </div>
                          <span className="timeline-step-label">{stepName}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Real-time Logistics Logs */}
                  <div className="logistics-tracking-logs-card">
                    <h4 className="logs-card-title">
                      <Clock size={16} /> Real-time Logistics Status Log
                    </h4>

                    <div className="logistics-timeline-logs-list">
                      {trackingOrder.statusLog.slice().reverse().map((log, idx) => (
                        <div className="logistics-log-row" key={idx}>
                          <div className="log-row-timestamp-column">
                            <span className="log-time">
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="log-date">
                              {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
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

                  {/* Shipping Address Summarized info inside tracking */}
                  <div className="tracking-shipping-details-card">
                    <h4 className="logs-card-title"><MapPin size={16} /> Delivered / Delivering to</h4>
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
