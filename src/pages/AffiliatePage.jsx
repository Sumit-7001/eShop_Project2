import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserPlus, Share2, DollarSign, CheckCircle } from 'lucide-react';
import '../styles/AffiliatePage.css';

const AffiliatePage = () => {
  const { openAuthModal } = useApp();
  const navigate = useNavigate();

  return (
    <div className="affiliate-page-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <div className="container">
          <p>Home &gt; Affiliate Program</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="affiliate-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Partner with MarketHub</h1>
            <p>
              Join our Affiliate Program and start earning today. Promote thousands of high-quality products from top brands and earn generous commissions on every successful sale.
            </p>
            <button className="cta-button" onClick={() => openAuthModal('signup')}>
              Become an Affiliate
            </button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card" onClick={() => openAuthModal('signup')} style={{ cursor: 'pointer' }}>
              <div className="step-icon">
                <UserPlus size={40} />
              </div>
              <h3>1. Sign Up</h3>
              <p>Register for our affiliate program for free. It takes only a few minutes to get started.</p>
            </div>
            
            <div className="step-card" onClick={() => navigate('/categories')} style={{ cursor: 'pointer' }}>
              <div className="step-icon">
                <Share2 size={40} />
              </div>
              <h3>2. Promote</h3>
              <p>Share your unique affiliate links on your website, blog, or social media channels.</p>
            </div>
            
            <div className="step-card" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <div className="step-icon">
                <DollarSign size={40} />
              </div>
              <h3>3. Earn</h3>
              <p>Earn up to 15% commission on every successful purchase made through your links.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="affiliate-benefits">
        <div className="container">
          <h2 className="section-title">Why Join Us?</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <CheckCircle size={24} className="check-icon" />
              <div>
                <h4>High Commission Rates</h4>
                <p>Earn competitive rates across all our product categories.</p>
              </div>
            </div>
            <div className="benefit-item">
              <CheckCircle size={24} className="check-icon" />
              <div>
                <h4>30-Day Cookie Duration</h4>
                <p>Get credited for sales even if the user buys days after clicking your link.</p>
              </div>
            </div>
            <div className="benefit-item">
              <CheckCircle size={24} className="check-icon" />
              <div>
                <h4>Dedicated Support</h4>
                <p>Our affiliate team is always ready to help you optimize your campaigns.</p>
              </div>
            </div>
            <div className="benefit-item">
              <CheckCircle size={24} className="check-icon" />
              <div>
                <h4>Real-time Tracking</h4>
                <p>Monitor your clicks, conversions, and earnings via our advanced dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="affiliate-cta-footer">
        <div className="container text-center">
          <h2>Ready to start earning?</h2>
          <p>Join thousands of affiliates who are already making money with MarketHub.</p>
          <button className="cta-button" onClick={() => openAuthModal('signup')}>
            Join Now for Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default AffiliatePage;
