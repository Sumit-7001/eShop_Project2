import React from 'react';
import { Lock, Eye, Database, Share2 } from 'lucide-react';
import '../styles/ReturnPolicyPage.css'; // Reusing generic policy styles

const PrivacyPolicyPage = () => {
  return (
    <div className="policy-page-wrapper">
      <div className="breadcrumb-area">
        <div className="container">
          <p>Home &gt; Privacy Policy</p>
        </div>
      </div>

      <section className="policy-hero" style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)' }}>
        <div className="container">
          <div className="hero-content">
            <Lock size={60} className="hero-icon" style={{ color: '#A7F3D0' }} />
            <h1>Privacy Policy</h1>
            <p>
              Your privacy is extremely important to us. This policy outlines how we collect, use, communicate, and safeguard your personal information.
            </p>
          </div>
        </div>
      </section>

      <section className="policy-content-section">
        <div className="container">
          <div className="policy-grid">
            
            <div className="policy-card">
              <div className="icon-wrapper" style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>
                <Database size={32} />
              </div>
              <h3>Data Collection</h3>
              <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with our support team. This includes your name, email, and shipping address.</p>
            </div>

            <div className="policy-card">
              <div className="icon-wrapper" style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>
                <Eye size={32} />
              </div>
              <h3>How We Use Data</h3>
              <p>We use your information to process transactions, deliver products, send order confirmations, and provide customer support. We may also use it to improve our platform's user experience.</p>
            </div>

            <div className="policy-card">
              <div className="icon-wrapper" style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>
                <Share2 size={32} />
              </div>
              <h3>Information Sharing</h3>
              <p>We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information with our business partners.</p>
            </div>

            <div className="policy-card">
              <div className="icon-wrapper" style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)' }}>
                <Lock size={32} />
              </div>
              <h3>Data Security</h3>
              <p>We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal info.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
