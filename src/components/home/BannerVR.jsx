import React from 'react';
import '../../styles/BannerVR.css';
import vrImage from '../../assets/images/vr.png';

const BannerVR = ({ onAddToCart }) => {
  return (
    <section className="vr-section">
      <div className="container">
        <div className="vr-banner">
          <div className="vr-content">
            <h2 className="vr-title">Virtual Reality Experience</h2>
            <p className="vr-description">
              Experience the extraordinary with our exclusive VR offer. Immerse yourself in limitless adventures today.
            </p>
            <button className="vr-cta-btn" onClick={onAddToCart}>Order Now Via Online Store</button>
          </div>
          <div className="vr-image-container">
            <img src={vrImage} alt="VR Headset" className="vr-img" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerVR;
