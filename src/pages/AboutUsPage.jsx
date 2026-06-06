import React from 'react';
import { Target, Users, Shield, Zap, Award, Globe } from 'lucide-react';
import '../styles/AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-page-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb-area">
        <div className="container">
          <p>Home &gt; About Us</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About MarketHub</h1>
            <p>
              We are on a mission to revolutionize the eCommerce experience by connecting buyers with the best products from top sellers worldwide. Quality, trust, and customer satisfaction are at the heart of everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="icon-box">
                <Target size={40} />
              </div>
              <h2>Our Mission</h2>
              <p>
                To provide a seamless, secure, and enjoyable shopping platform that empowers businesses to grow and offers consumers an unparalleled variety of high-quality products.
              </p>
            </div>
            <div className="mv-card">
              <div className="icon-box">
                <Globe size={40} />
              </div>
              <h2>Our Vision</h2>
              <p>
                To become the world's most trusted and customer-centric marketplace, where anyone can find and discover anything they might want to buy online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="core-values">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <Shield size={32} className="value-icon" />
              <h3>Trust & Security</h3>
              <p>We ensure secure transactions and protect user data at all costs.</p>
            </div>
            <div className="value-item">
              <Users size={32} className="value-icon" />
              <h3>Customer First</h3>
              <p>Every decision we make is aimed at improving the customer experience.</p>
            </div>
            <div className="value-item">
              <Zap size={32} className="value-icon" />
              <h3>Innovation</h3>
              <p>We continuously evolve our platform with the latest technologies.</p>
            </div>
            <div className="value-item">
              <Award size={32} className="value-icon" />
              <h3>Quality Assurance</h3>
              <p>We partner only with verified sellers to guarantee product quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-box">
              <h3>10K+</h3>
              <p>Active Sellers</p>
            </div>
            <div className="stat-box">
              <h3>5M+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-box">
              <h3>100+</h3>
              <p>Product Categories</p>
            </div>
            <div className="stat-box">
              <h3>24/7</h3>
              <p>Customer Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
