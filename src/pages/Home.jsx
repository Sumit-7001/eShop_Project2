import React, { memo } from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoriesRow from '../components/home/CategoriesRow';
import BrandsRow from '../components/home/BrandsRow';
import PromoBanner from '../components/home/PromoBanner';
import BannerVR from '../components/home/BannerVR';
import AppDownload from '../components/home/AppDownload';
import SectionTitle from '../components/common/SectionTitle';
import ProductCard from '../components/common/ProductCard';
import { useApp } from '../context/AppContext';

const Home = () => {
  // Phase 1 BUG FIX: Use live state from context (not static dummyData imports)
  const {
    smartphonesState,
    watchesState,
    furnitureState,
    kidsState,
    addToCart,
    favoriteItems,
    compareItems,
    toggleFavorite,
    toggleCompare,
    isFavorite,
    isComparing,
  } = useApp();

  return (
    <main>
      <HeroSection />

      <CategoriesRow />

      <BrandsRow />

      <PromoBanner />

      <section className="products-grid-section">
        <div className="container">
          <SectionTitle title="Smartphones & Basic Mobiles" viewMoreLink="/category/smartphones" />
          <div className="products-grid">
            {smartphonesState.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isFavorite={isFavorite(product.id)}
                isComparing={isComparing(product.id)}
                onToggleFavorite={toggleFavorite}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        </div>
      </section>

      <BannerVR />

      <section className="products-grid-section">
        <div className="container">
          <SectionTitle title="Top Rated Watches" viewMoreLink="/category/watches" />
          <div className="products-grid">
            {watchesState.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isFavorite={isFavorite(product.id)}
                isComparing={isComparing(product.id)}
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
            {furnitureState.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isFavorite={isFavorite(product.id)}
                isComparing={isComparing(product.id)}
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
            {kidsState.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                isFavorite={isFavorite(product.id)}
                isComparing={isComparing(product.id)}
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

export default memo(Home);
