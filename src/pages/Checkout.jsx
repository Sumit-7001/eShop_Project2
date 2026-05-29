import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, Landmark, Truck, CheckCircle2, AlertCircle, ShoppingBag, ArrowLeft, Check, MapPin, ClipboardCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import '../styles/Checkout.css';

const Checkout = () => {
  const { cartItems, clearCart } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping Address, 2: Payment Method, 3: Review & Place Order

  // If cart is empty, redirect to home/cart
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      // Allow modal to show if order is placed, otherwise redirect
      if (!orderSuccess) {
        navigate('/cart');
      }
    }
  }, [cartItems, navigate]);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  // Errors state
  const [errors, setErrors] = useState({});

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'SAVE10', discount: 10, type: 'percent' }
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Loading & Success states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  // Calculate Prices
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Base shipping is $10, free if subtotal is over $150 or if FREESHIP promo is active
  const baseShipping = subtotal >= 150 ? 0 : 10;
  const shipping = appliedPromo?.code === 'FREESHIP' ? 0 : baseShipping;

  // Discount calculation
  let discount = 0;
  if (appliedPromo?.type === 'percent') {
    discount = subtotal * (appliedPromo.discount / 100);
  }

  const total = subtotal + shipping - discount;

  // Input Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Payment Method handler
  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  // Promo Code verification
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a coupon code.');
      setPromoSuccess('');
      return;
    }

    if (code === 'SAVE10') {
      setAppliedPromo({ code: 'SAVE10', discount: 10, type: 'percent' });
      setPromoSuccess('Promo code SAVE10 (10% Off) applied successfully!');
      setPromoError('');
    } else if (code === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', discount: shipping, type: 'shipping' });
      setPromoSuccess('Promo code FREESHIP (Free Shipping) applied successfully!');
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try SAVE10 or FREESHIP.');
      setPromoSuccess('');
    }
  };

  // Validate Step 1 (Shipping & Contact)
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State/Province is required';
    if (!formData.zip.trim()) newErrors.zip = 'ZIP/Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2 (Payment card details if credit card selected)
  const validateStep2 = () => {
    const newErrors = {};

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }

      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Invalid expiry date (MM/YY)';
      }

      if (!formData.cardCvv.trim()) {
        newErrors.cardCvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cardCvv)) {
        newErrors.cardCvv = 'CVV must be 3 or 4 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step Navigations
  const handleToPayment = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToReview = () => {
    if (validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Place Order Action
  const handlePlaceOrder = () => {
    // Perform absolute check of everything
    if (!validateStep1()) {
      setStep(1);
      return;
    }
    if (!validateStep2()) {
      setStep(2);
      return;
    }

    setIsSubmitting(true);

    // Simulate Payment / Server Request
    setTimeout(() => {
      const orderId = 'ORD-' + Math.floor(1000000 + Math.random() * 9000000);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5); // Est. delivery in 5 days
      const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const orderDetails = {
        orderId,
        deliveryEstimate: formattedDelivery,
        total: total,
        paymentMethod: formData.paymentMethod === 'card' ? 'Credit Card' : formData.paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery',
        email: formData.email
      };

      setPlacedOrderDetails(orderDetails);

      // Send Real Order Confirmation Invoice Email via Google SMTP backend API
      const API_URL = import.meta.env.VITE_API_URL || 'https://backend-teal-eta-97.vercel.app/api/auth';
      fetch(`${API_URL}/order-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          orderId,
          total,
          paymentMethod: orderDetails.paymentMethod,
          deliveryEstimate: formattedDelivery,
          items: cartItems.map(item => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        })
      }).catch(err => console.error('Failed to trigger order confirmation email:', err));

      setIsSubmitting(false);
      setOrderSuccess(true);
      clearCart(); // Empty the cart items
    }, 2000);
  };

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="checkout-breadcrumb">
          <ul>
            <li><Link to="/">Home</Link> <ChevronRight size={14} /></li>
            <li><Link to="/cart">Cart</Link> <ChevronRight size={14} /></li>
            <li className="active">Checkout</li>
          </ul>
        </div>

        {/* 3-Step Progress Stepper */}
        <div className="checkout-stepper-container">
          <div className="step-connector-line">
            <div className={`step-connector-line-progress step-progress-${step}`}></div>
          </div>
          
          <div 
            className={`step-indicator ${step === 1 ? 'active' : 'completed'}`}
            onClick={() => step > 1 && setStep(1)}
          >
            <div className="step-circle">
              {step > 1 ? <Check size={16} /> : 1}
            </div>
            <div className="step-label">Shipping</div>
          </div>

          <div 
            className={`step-indicator ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}
            onClick={() => step > 2 && setStep(2)}
          >
            <div className="step-circle">
              {step > 2 ? <Check size={16} /> : 2}
            </div>
            <div className="step-label">Payment</div>
          </div>

          <div 
            className={`step-indicator ${step === 3 ? 'active' : ''}`}
          >
            <div className="step-circle">3</div>
            <div className="step-label">Review Order</div>
          </div>
        </div>

        <div className="checkout-container wizard-layout">
          {/* Centered Single Column Form Box */}
          <div className="checkout-wizard-card checkout-card">
            
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div>
                <h3 className="checkout-card-title">
                  <Truck size={20} color="#ff7e5f" />
                  Shipping Information
                </h3>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`form-control ${errors.name ? 'error' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-control ${errors.email ? 'error' : ''}`}
                      placeholder="johndoe@example.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-control ${errors.phone ? 'error' : ''}`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>Street Address *</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`form-control ${errors.address ? 'error' : ''}`}
                      placeholder="123 Main St, Apt 4B"
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>

                  <div className="form-group">
                    <label>City *</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`form-control ${errors.city ? 'error' : ''}`}
                      placeholder="New York"
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label>State / Province *</label>
                    <input 
                      type="text" 
                      name="state" 
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`form-control ${errors.state ? 'error' : ''}`}
                      placeholder="NY"
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>

                  <div className="form-group">
                    <label>ZIP / Postal Code *</label>
                    <input 
                      type="text" 
                      name="zip" 
                      value={formData.zip}
                      onChange={handleInputChange}
                      className={`form-control ${errors.zip ? 'error' : ''}`}
                      placeholder="10001"
                    />
                    {errors.zip && <span className="error-message">{errors.zip}</span>}
                  </div>

                  <div className="form-group">
                    <label>Country *</label>
                    <select 
                      name="country" 
                      value={formData.country}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="India">India</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                </div>

                <div className="step-actions-row">
                  <Link to="/cart" className="prev-step-btn" style={{ textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to Cart
                  </Link>
                  <button type="button" className="next-step-btn" onClick={handleToPayment}>
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div>
                <h3 className="checkout-card-title">
                  <CreditCard size={20} color="#ff7e5f" />
                  Payment Method
                </h3>

                <div className="payment-methods">
                  <div 
                    className={`payment-method-card ${formData.paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodChange('card')}
                  >
                    <input 
                      type="radio" 
                      name="paymentRadio" 
                      checked={formData.paymentMethod === 'card'} 
                      onChange={() => {}}
                    />
                    <div>
                      <div className="payment-method-info">
                        <CreditCard size={18} />
                        Credit or Debit Card
                      </div>
                      <div className="payment-method-desc">Pay securely using your Visa, Mastercard, or Amex card.</div>
                    </div>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="card-details-fields">
                      <div className="form-group">
                        <label>Card Number *</label>
                        <input 
                          type="text" 
                          name="cardNumber" 
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`form-control ${errors.cardNumber ? 'error' : ''}`}
                          placeholder="1234 5678 1234 5678"
                          maxLength="16"
                        />
                        {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                      </div>
                      
                      <div className="form-grid" style={{ marginTop: '0px' }}>
                        <div className="form-group">
                          <label>Expiry Date *</label>
                          <input 
                            type="text" 
                            name="cardExpiry" 
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            className={`form-control ${errors.cardExpiry ? 'error' : ''}`}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
                        </div>

                        <div className="form-group">
                          <label>CVV *</label>
                          <input 
                            type="password" 
                            name="cardCvv" 
                            value={formData.cardCvv}
                            onChange={handleInputChange}
                            className={`form-control ${errors.cardCvv ? 'error' : ''}`}
                            placeholder="123"
                            maxLength="4"
                          />
                          {errors.cardCvv && <span className="error-message">{errors.cardCvv}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  <div 
                    className={`payment-method-card ${formData.paymentMethod === 'paypal' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodChange('paypal')}
                  >
                    <input 
                      type="radio" 
                      name="paymentRadio" 
                      checked={formData.paymentMethod === 'paypal'} 
                      onChange={() => {}}
                    />
                    <div>
                      <div className="payment-method-info">
                        <Landmark size={18} />
                        PayPal
                      </div>
                      <div className="payment-method-desc">Redirect to PayPal to complete your purchase.</div>
                    </div>
                  </div>

                  <div 
                    className={`payment-method-card ${formData.paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => handlePaymentMethodChange('cod')}
                  >
                    <input 
                      type="radio" 
                      name="paymentRadio" 
                      checked={formData.paymentMethod === 'cod'} 
                      onChange={() => {}}
                    />
                    <div>
                      <div className="payment-method-info">
                        <Truck size={18} />
                        Cash on Delivery
                      </div>
                      <div className="payment-method-desc">Pay cash when your order is delivered to your door.</div>
                    </div>
                  </div>
                </div>

                <div className="step-actions-row">
                  <button type="button" className="prev-step-btn" onClick={() => setStep(1)}>
                    Back to Shipping
                  </button>
                  <button type="button" className="next-step-btn" onClick={handleToReview}>
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Pure Order Review & Billing */}
            {step === 3 && (
              <div>
                <h3 className="checkout-card-title">
                  <ClipboardCheck size={20} color="#ff7e5f" />
                  Review Your Order
                </h3>

                {/* Info summary grid (Address & Payment summarized) */}
                <div className="review-summary-grid">
                  <div className="review-summary-block">
                    <h4 className="review-block-title">
                      <MapPin size={16} /> Shipping Address
                    </h4>
                    <p><strong>{formData.name}</strong></p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.zip}</p>
                    <p>{formData.country}</p>
                    <p>Phone: {formData.phone}</p>
                    <button type="button" className="edit-step-btn" onClick={() => setStep(1)}>Edit Address</button>
                  </div>

                  <div className="review-summary-block">
                    <h4 className="review-block-title">
                      <CreditCard size={16} /> Payment Method
                    </h4>
                    <p>
                      <strong>
                        {formData.paymentMethod === 'card' 
                          ? 'Credit/Debit Card' 
                          : formData.paymentMethod === 'paypal' 
                            ? 'PayPal Account' 
                            : 'Cash on Delivery (COD)'}
                      </strong>
                    </p>
                    {formData.paymentMethod === 'card' && (
                      <p className="card-masked-info">Card ending in **** {formData.cardNumber.slice(-4)}</p>
                    )}
                    <button type="button" className="edit-step-btn" onClick={() => setStep(2)}>Edit Payment</button>
                  </div>
                </div>

                {/* Cart Items list in wizard */}
                <h4 className="review-items-title">
                  <ShoppingBag size={16} /> Items in Order
                </h4>
                
                <div className="review-items-list">
                  {cartItems.map(item => (
                    <div className="review-item" key={item.id}>
                      <img src={item.image} alt={item.title} className="review-item-img" />
                      <div className="review-item-info">
                        <h5 className="review-item-name">{item.title}</h5>
                        <p className="review-item-subtitle">{item.subtitle || 'Premium Quality'}</p>
                        <span className="review-item-qty-tag">Qty: {item.quantity}</span>
                      </div>
                      <div className="review-item-price">${(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input inside wizard */}
                <div className="review-promo-section">
                  <h4 className="review-items-title" style={{ marginTop: 0, marginBottom: '10px' }}>Apply Coupon</h4>
                  <div className="promo-code-container" style={{ margin: 0, padding: 0, border: 'none' }}>
                    <input 
                      type="text" 
                      placeholder="Promo Code (SAVE10 / FREESHIP)" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="promo-input"
                    />
                    <button 
                      type="button" 
                      onClick={handleApplyPromo}
                      className="promo-apply-btn"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <div className="promo-message error">{promoError}</div>}
                  {promoSuccess && <div className="promo-message success">{promoSuccess}</div>}
                </div>

                {/* Final Bill calculations */}
                <div className="review-bill-card">
                  <div className="review-bill-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="review-bill-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}</span>
                  </div>

                  {discount > 0 && (
                    <div className="review-bill-row discount-row">
                      <span>Discount ({appliedPromo?.code})</span>
                      <span>-${discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="review-bill-row grand-total">
                    <span>Total Amount</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="step-actions-row">
                  <button type="button" className="prev-step-btn" onClick={() => setStep(2)}>
                    Back to Payment
                  </button>
                  <button 
                    type="button" 
                    className="next-step-btn place-order-final-btn" 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing Order...' : `Place Order - $${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {orderSuccess && placedOrderDetails && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={48} />
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for shopping with eShop. Your order has been placed and is being processed.</p>
            
            <div className="order-details-card">
              <div>
                <span>Order ID:</span>
                <strong>{placedOrderDetails.orderId}</strong>
              </div>
              <div>
                <span>Amount Paid:</span>
                <strong>${placedOrderDetails.total.toLocaleString()}</strong>
              </div>
              <div>
                <span>Payment Method:</span>
                <strong>{placedOrderDetails.paymentMethod}</strong>
              </div>
              <div>
                <span>Est. Delivery:</span>
                <strong>{placedOrderDetails.deliveryEstimate}</strong>
              </div>
              <div>
                <span>Confirmation sent to:</span>
                <strong>{placedOrderDetails.email}</strong>
              </div>
            </div>

            <button 
              className="continue-btn"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
