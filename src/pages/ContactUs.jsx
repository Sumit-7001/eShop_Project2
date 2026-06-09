import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import '../styles/ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-page">
      <div className="breadcrumb-area">
        <div className="container">
          <p>Home <span> &gt; </span> Contact Us</p>
        </div>
      </div>

      <div className="container">
        
        <div className="contact-form-section">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle">Reach out to us from our contact form and we will get back to you shortly.</p>

          <form className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <input type="text" placeholder="Username" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Email" required />
              </div>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Subject" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Your message" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
        <div className="contact-info-card">
          <div className="info-item">
            <div className="info-icon">
              <MapPin size={24} />
            </div>
            <div className="info-content">
              <h4>Find Us</h4>
              <p>MarketHub Headquarters, Salt Lake Sector V, Kolkata, West Bengal 700091, India</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <Phone size={24} />
            </div>
            <div className="info-content">
              <h4>Contact Us</h4>
              <p>+91 98765 43210</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <Mail size={24} />
            </div>
            <div className="info-content">
              <h4>Email Us</h4>
              <p>support@markethub.com</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;
