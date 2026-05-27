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

const Home = ({ 
  addToCart, 
  favoriteItems = [], 
  compareItems = [], 
  toggleFavorite, 
  toggleCompare 
}) => {
  return (
    <main>
      <HeroSection onAddToCart={addToCart} />
      
      <CategoriesRow />
      
      <BrandsRow />

      <PromoBanner />

      <section className="products-grid-section">
        <div className="container">
          <SectionTitle title="Smartphones & Basic Mobiles" viewMoreLink="/category/smartphones" />
          <div className="products-grid">
            {smartphones.slice(0, 4).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
                isFavorite={favoriteItems.some(item => item.id === product.id)}
                isComparing={compareItems.some(item => item.id === product.id)}
                onToggleFavorite={toggleFavorite}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        </div>
      </section>

      <BannerVR onAddToCart={addToCart} />

      <section className="products-grid-section">
        <div className="container">
          <SectionTitle title="Top Rated Watches" viewMoreLink="/category/watches" />
          <div className="products-grid">
            {watches.slice(0, 4).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
                isFavorite={favoriteItems.some(item => item.id === product.id)}
                isComparing={compareItems.some(item => item.id === product.id)}
                onToggleFavorite={toggleFavorite}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="products-grid-section">
        <div className="container">
          <SectionTitle title="Top Rated Furniture Products" viewMoreLink="/category/furniture" />
          <div className="products-grid">
            {furniture.slice(0, 4).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
                isFavorite={favoriteItems.some(item => item.id === product.id)}
                isComparing={compareItems.some(item => item.id === product.id)}
                onToggleFavorite={toggleFavorite}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="products-grid-section kids-bg">
        <div className="container">
          <SectionTitle title="Kid's Section" viewMoreLink="/category/kids" />
          <div className="products-grid">
            {kids.slice(0, 4).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
                isFavorite={favoriteItems.some(item => item.id === product.id)}
                isComparing={compareItems.some(item => item.id === product.id)}
                onToggleFavorite={toggleFavorite}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        </div>
      </section>

      <AppDownload />
    </main>
  );
};

export default Home;
