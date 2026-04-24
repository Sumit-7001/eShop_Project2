import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import Sellers from './pages/Sellers';
import AllCategoriesPage from './pages/AllCategoriesPage';
import AllBrandsPage from './pages/AllBrandsPage';
import Blogs from './pages/Blogs';
import FAQPage from './pages/FAQPage';
import AuthModal from './components/common/AuthModal';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const openAuthModal = (mode) => setAuthModal({ isOpen: true, mode });
  const closeAuthModal = () => setAuthModal({ ...authModal, isOpen: false });

  return (
    <Router>
      <div className="App">
        <Header 
          cartCount={cartCount} 
          openLogin={() => openAuthModal('login')} 
          openSignup={() => openAuthModal('signup')} 
        />
        
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/categories" element={<AllCategoriesPage />} />
          <Route path="/brands" element={<AllBrandsPage />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>

        <Footer />

        <AuthModal 
          isOpen={authModal.isOpen} 
          onClose={closeAuthModal} 
          initialMode={authModal.mode} 
        />
      </div>
    </Router>
  );
}

export default App;
