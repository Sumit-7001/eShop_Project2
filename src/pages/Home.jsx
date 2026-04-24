import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoriesRow from '../components/home/CategoriesRow';
import BrandsRow from '../components/home/BrandsRow';
import PromoBanner from '../components/home/PromoBanner';
import BannerVR from '../components/home/BannerVR';
import AppDownload from '../components/home/AppDownload';
import SectionTitle from '../components/common/SectionTitle';
import ProductCard from '../components/common/ProductCard';
import { smartphones, watches, furniture, kids } from '../data/dummyData';

const Home = ({ addToCart }) => {
  return (
    <main>
      <HeroSection onAddToCart={addToCart} />
      
      <CategoriesRow />
      
      <BrandsRow />

      <PromoBanner />

      <section className="products-grid-section">
        <div className="container">
          <SectionTitle title="Smartphones & Basic Mobiles" />
          <div className="products-grid">
            {smartphones.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <BannerVR onAddToCart={addToCart} />

      <section className="products-grid-section">
        <div className="container">
          <SectionTitle title="Top Rated Watches" />
          <div className="products-grid">
            {watches.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <section className="products-grid-section">
        <div className="container">
          <SectionTitle title="Top Rated Furniture Products" />
          <div className="products-grid">
            {furniture.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <section className="products-grid-section kids-bg">
        <div className="container">
          <SectionTitle title="Kid's Section" />
          <div className="products-grid">
            {kids.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <AppDownload />
    </main>
  );
};

export default Home;
