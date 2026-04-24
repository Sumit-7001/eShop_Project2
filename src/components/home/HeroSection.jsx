import React, { useState, useEffect } from 'react';
import '../../styles/HeroSection.css';
import heroImage from '../../assets/images/hero.png';

const slides = [
  {
    id: 1,
    title: 'Explore The Latest Arrivals Featuring Fresh Designs',
    highlight: 'Fresh Designs',
    description: 'Must-Have Pieces That Define The Season\'s Biggest Fashion Trends. Shop the latest collection now.',
    image: heroImage,
    category: 'Fashion'
  },
  {
    id: 2,
    title: 'Next-Gen Smartphones with Amazing Features',
    highlight: 'Smartphones',
    description: 'Upgrade your tech with our latest collection of premium smartphones. Powerful, sleek, and smart.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
    category: 'Phones'
  },
  {
    id: 3,
    title: 'Timeless Elegance on Your Wrist',
    highlight: 'Luxury Watches',
    description: 'Discover our curated collection of luxury and smart watches. Perfect for every occasion.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    category: 'Watches'
  },
  {
    id: 4,
    title: 'Upgrade Your Home with Modern Appliances',
    highlight: 'Modern Living',
    description: 'Effortless living with our range of high-efficiency home and kitchen appliances. Quality you can trust.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=800&fit=crop',
    category: 'Appliances'
  }
];

const HeroSection = ({ onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500); // Change every 4.5 seconds as requested

    return () => clearInterval(timer);
  }, []);

  const { title, highlight, description, image } = slides[currentSlide];

  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-left">
          <div className="hero-image-wrapper" key={currentSlide}>
            <img src={image} alt="Promotion" className="hero-image fade-in" />
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
          </div>
        </div>
        <div className="hero-right" key={`text-${currentSlide}`}>
          <h1 className="hero-heading fade-in-right">
            {title.split(highlight)[0]}
            <span className="highlight">{highlight}</span>
            {title.split(highlight)[1]}
          </h1>
          <p className="hero-description fade-in-right delay-1">
            {description}
          </p>
          <button className="shop-now-btn" onClick={onAddToCart}>Shop Now</button>
          
          <div className="slider-dots">
            {slides.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
