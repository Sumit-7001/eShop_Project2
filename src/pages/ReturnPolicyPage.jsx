import React from 'react';
import { RefreshCcw, CheckCircle, Clock, AlertTriangle, CreditCard, Truck } from 'lucide-react';
import '../styles/ReturnPolicyPage.css';

const ReturnPolicyPage = () => {
  return (
    <div className="policy-page-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <div className="container">
          <p>Home &gt; Return Policy</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="policy-hero">
        <div className="container">
          <div className="hero-content">
            <RefreshCcw size={60} className="hero-icon" />
            <h1>Return & Refund Policy</h1>
            <p>
              We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help make things right.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="policy-content-section">
        <div className="container">
          <div className="policy-grid">
            
            {/* Condition 1 */}
            <div className="policy-card">
              <div className="icon-wrapper">
                <Clock size={32} />
              </div>
              <h3>30-Day Returns</h3>
              <p>You have 30 calendar days to return an item from the date you received it. The return window starts on the day of delivery.</p>
            </div>

            {/* Condition 2 */}
            <div className="policy-card">
              <div className="icon-wrapper">
                <CheckCircle size={32} />
              </div>
              <h3>Eligibility Criteria</h3>
              <p>To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging with tags attached.</p>
            </div>

            {/* Condition 3 */}
            <div className="policy-card">
              <div className="icon-wrapper">
                <CreditCard size={32} />
              </div>
              <h3>Refund Process</h3>
              <p>Once we receive your item, we will inspect it and notify you. If your return is approved, we will initiate a refund to your original method of payment within 5-7 business days.</p>
            </div>

            {/* Condition 4 */}
            <div className="policy-card">
              <div className="icon-wrapper">
                <Truck size={32} />
              </div>
              <h3>Return Shipping</h3>
              <p>You will be responsible for paying your own shipping costs for returning the item unless the item received was damaged or defective. Shipping costs are non-refundable.</p>
            </div>

            {/* Condition 5 */}
            <div className="policy-card">
              <div className="icon-wrapper">
                <AlertTriangle size={32} />
              </div>
              <h3>Non-Returnable Items</h3>
              <p>Certain items cannot be returned, including perishable goods (like food or flowers), custom products, personal care goods, and digital downloads.</p>
            </div>

            {/* Condition 6 */}
            <div className="policy-card">
              <div className="icon-wrapper">
                <RefreshCcw size={32} />
              </div>
              <h3>Exchanges</h3>
              <p>We only replace items if they are defective or damaged upon arrival. If you need to exchange it for the same item, please contact our support team.</p>
            </div>

          </div>

          <div className="contact-support-box">
            <h2>Need help with a return?</h2>
            <p>Our customer support team is available 24/7 to assist you with the return process.</p>
            <button className="support-btn" onClick={() => window.location.href = '/contact'}>
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReturnPolicyPage;
