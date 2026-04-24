import React from 'react';
import '../../styles/AppDownload.css';
import appImage from '../../assets/images/app.png';

const AppDownload = () => {
  return (
    <section className="app-download-section">
      <div className="container app-container">
        <div className="app-left">
          <img src={appImage} alt="eShop Mobile App" className="app-mobile-img" />
        </div>
        <div className="app-right">
          <h2 className="app-title">eShop Mobile App</h2>
          <p className="app-subtitle">Affordable Ecommerce Platform</p>
          <p className="app-description">
            Shop with us at affordable prices and get exciting cashback & offers. Download our app for a better shopping experience.
          </p>
          <div className="app-buttons">
            <button className="download-btn">
              <img src="https://i.pinimg.com/1200x/2e/ed/eb/2eedeba9c1499b6348bdc85e1ae82808.jpg" alt="Apple" className="btn-logo" />
              <div className="btn-text">
                <span className="small">DOWNLOAD ON THE</span>
                <span className="large">App Store</span>
              </div>
            </button>
            <button className="download-btn">
              <img src="https://i.pinimg.com/736x/15/f9/7c/15f97cd069c5ae768e86d550d42ca76b.jpg" alt="Android" className="btn-logo" />
              <div className="btn-text">
                <span className="small">GET IT ON</span>
                <span className="large">Google Play</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
