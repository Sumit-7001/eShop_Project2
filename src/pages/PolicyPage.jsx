import React from 'react';
import '../styles/FAQPage.css'; // Reuse FAQ styling for simplicity

const PolicyPage = ({ title, content }) => {
  return (
    <div className="faq-page-wrapper">
      <div className="breadcrumb-area">
        <div className="container">
          <p>Home &gt; {title}</p>
        </div>
      </div>

      <main className="container faq-main" style={{ minHeight: '50vh', padding: '40px 0' }}>
        <div className="faq-card" style={{ padding: '30px' }}>
          <h2>{title}</h2>
          <div style={{ marginTop: '20px', lineHeight: '1.6', color: 'var(--text-light)' }}>
            {content.map((paragraph, index) => (
              <p key={index} style={{ marginBottom: '15px' }}>{paragraph}</p>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PolicyPage;
