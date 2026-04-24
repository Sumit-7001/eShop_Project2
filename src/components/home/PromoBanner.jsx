import React from 'react';
import '../../styles/PromoBanner.css';
import promoImage from '../../assets/images/promo.png';

const PromoBanner = () => {
  return (
    <section className="promo-section">
      <div className="container">
        <div className="promo-banner">
          <div className="promo-content">
            <span className="promo-tag">FASHION</span>
            <h2 className="promo-title">Big Promo <br /> Summer Sale.</h2>
            <p className="promo-url">www.eShop.com</p>
            <div className="promo-dots">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="promo-image-container">
            <img src={promoImage} alt="Promo Model" className="promo-img" />
            <div className="promo-overlay-text">
              <span className="number">03.</span>
              <span className="label">Best Outfit For You.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
