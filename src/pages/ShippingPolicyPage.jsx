import React from 'react';
import { Truck, Clock, Globe, ShieldCheck, Box, HelpCircle } from 'lucide-react';
import '../styles/ReturnPolicyPage.css'; // Reusing the same generic policy styles

const ShippingPolicyPage = () => {
  return (
    <div className="policy-page-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <div className="container">
          <p>Home &gt; Shipping Policy</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="policy-hero">
        <div className="container">
          <div className="hero-content">
            <Truck size={60} className="hero-icon" />
            <h1>Shipping & Delivery Policy</h1>
            <p>
              We are committed to delivering your orders as quickly and efficiently as possible. Below is everything you need to know about our shipping procedures.
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
              <h3>Processing Time</h3>
              <p>All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or public holidays.</p>
            </div>

            {/* Condition 2 */}
            <div className="policy-card">
              <div className="icon-wrapper">
                <Truck size={32} />
              </div>
              <h3>Shipping Rates & Estimates</h3>
              <p>Shipping charges for your order will be calculated and displayed at checkout. Standard delivery typically takes 3-5 business days.</p>
            </div>

            {/* Condition 3 */}
            <div className="policy-card">
              <div className="icon-wrapper">
                <Globe size={32} />
              </div>
              <h3>International Shipping</h3>
              <p>We currently offer international shipping to select countries. Please note that delivery times will vary depending on your location and customs processing.</p>
            </div>

            {/* Condition 4 */}
            <div className="policy-card">
              <div className="icon-wrapper">
                <ShieldCheck size={32} />
              </div>
              <h3>Customs, Duties & Taxes</h3>
              <p>MarketHub is not responsible for any customs and taxes applied to your order. All fees imposed during or after shipping are the responsibility of the customer.</p>
            </div>

            {/* Condition 5 */}
            <div className="policy-card">
              <div className="icon-wrapper">
                <Box size={32} />
              </div>
              <h3>Damages</h3>
              <p>If you receive your order damaged, please contact us immediately. Save all packaging materials and damaged goods before filing a claim.</p>
            </div>

            {/* Condition 6 */}
            <div className="policy-card">
              <div className="icon-wrapper">
                <HelpCircle size={32} />
              </div>
              <h3>Order Tracking</h3>
              <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking will be active within 24 hours.</p>
            </div>

          </div>

          <div className="contact-support-box">
            <h2>Have questions about your delivery?</h2>
            <p>Our support team is always ready to provide you with the latest updates on your shipments.</p>
            <button className="support-btn" onClick={() => window.location.href = '/contact'}>
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicyPage;
