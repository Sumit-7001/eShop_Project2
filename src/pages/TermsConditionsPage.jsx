import React from 'react';
import { FileText, Shield, UserCheck, AlertOctagon } from 'lucide-react';
import '../styles/ReturnPolicyPage.css'; // Reusing generic policy styles

const TermsConditionsPage = () => {
  return (
    <div className="policy-page-wrapper">
      <div className="breadcrumb-area">
        <div className="container">
          <p>Home &gt; Terms & Conditions</p>
        </div>
      </div>

      <section className="policy-hero" style={{ background: 'linear-gradient(135deg, #374151 0%, #111827 100%)' }}>
        <div className="container">
          <div className="hero-content">
            <FileText size={60} className="hero-icon" style={{ color: '#60A5FA' }} />
            <h1>Terms & Conditions</h1>
            <p>
              Please read these terms and conditions carefully before using Our Service. These terms govern your use of MarketHub and all related services.
            </p>
          </div>
        </div>
      </section>

      <section className="policy-content-section">
        <div className="container">
          <div className="policy-grid">
            
            <div className="policy-card">
              <div className="icon-wrapper" style={{ color: '#60A5FA', background: 'rgba(96, 165, 250, 0.1)' }}>
                <UserCheck size={32} />
              </div>
              <h3>1. User Accounts</h3>
              <p>When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.</p>
            </div>

            <div className="policy-card">
              <div className="icon-wrapper" style={{ color: '#60A5FA', background: 'rgba(96, 165, 250, 0.1)' }}>
                <Shield size={32} />
              </div>
              <h3>2. Intellectual Property</h3>
              <p>The Service and its original content, features, and functionality are and will remain the exclusive property of MarketHub and its licensors.</p>
            </div>

            <div className="policy-card">
              <div className="icon-wrapper" style={{ color: '#60A5FA', background: 'rgba(96, 165, 250, 0.1)' }}>
                <AlertOctagon size={32} />
              </div>
              <h3>3. Termination</h3>
              <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.</p>
            </div>

            <div className="policy-card" style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--text-dark)' }}>4. Limitation of Liability</h3>
              <p style={{ color: 'var(--text-gray)', lineHeight: '1.8' }}>
                In no event shall MarketHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsConditionsPage;
