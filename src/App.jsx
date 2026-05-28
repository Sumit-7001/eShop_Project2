import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import Sellers from './pages/Sellers';
import AllCategoriesPage from './pages/AllCategoriesPage';
import AllBrandsPage from './pages/AllBrandsPage';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import FAQPage from './pages/FAQPage';
import CategoryProducts from './pages/CategoryProducts';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Compare from './pages/Compare';
import SellerProducts from './pages/SellerProducts';
import BrandProducts from './pages/BrandProducts';
import AdminDashboard from './pages/AdminDashboard';
import AuthModal from './components/common/AuthModal';
import { CheckCircle } from 'lucide-react';
import { smartphones, watches, furniture, kids } from './data/dummyData';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // null, or { name, email, role }
  const [smartphonesState, setSmartphonesState] = useState(smartphones);
  const [watchesState, setWatchesState] = useState(watches);
  const [furnitureState, setFurnitureState] = useState(furniture);
  const [kidsState, setKidsState] = useState(kids);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    // Show alert
    setNotification({ show: true, message: 'product added' });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleFavorite = (product) => {
    setFavoriteItems(prev => {
      const isFav = prev.some(item => item.id === product.id);
      if (isFav) {
        setNotification({ show: true, message: 'Removed from favorites' });
        setTimeout(() => setNotification({ show: false, message: '' }), 2000);
        return prev.filter(item => item.id !== product.id);
      } else {
        setNotification({ show: true, message: 'Added to favorites!' });
        setTimeout(() => setNotification({ show: false, message: '' }), 2000);
        return [...prev, product];
      }
    });
  };

  const toggleCompare = (product) => {
    setCompareItems(prev => {
      const isComparing = prev.some(item => item.id === product.id);
      if (isComparing) {
        setNotification({ show: true, message: 'Removed from comparison' });
        setTimeout(() => setNotification({ show: false, message: '' }), 2000);
        return prev.filter(item => item.id !== product.id);
      } else {
        if (prev.length >= 4) {
          setNotification({ show: true, message: 'You can compare up to 4 products only' });
          setTimeout(() => setNotification({ show: false, message: '' }), 3000);
          return prev;
        }
        setNotification({ show: true, message: 'Added to comparison!' });
        setTimeout(() => setNotification({ show: false, message: '' }), 2000);
        return [...prev, product];
      }
    });
  };

  const removeFromCompare = (id) => {
    setCompareItems(prev => prev.filter(item => item.id !== id));
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setNotification({ show: true, message: `Welcome back, ${user.role === 'admin' ? 'Store Owner' : user.name}!` });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setNotification({ show: true, message: 'Logged out successfully!' });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const addProduct = (newProduct) => {
    const productWithId = { 
      ...newProduct, 
      id: Date.now(), 
      rating: 5.0, 
      image: newProduct.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&fit=crop' 
    };
    if (newProduct.category === 'smartphones') {
      setSmartphonesState(prev => [productWithId, ...prev]);
    } else if (newProduct.category === 'watches') {
      setWatchesState(prev => [productWithId, ...prev]);
    } else if (newProduct.category === 'furniture') {
      setFurnitureState(prev => [productWithId, ...prev]);
    } else if (newProduct.category === 'kids') {
      setKidsState(prev => [productWithId, ...prev]);
    }
    setNotification({ show: true, message: 'Product added successfully!' });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const deleteProduct = (id, category) => {
    if (category === 'smartphones') {
      setSmartphonesState(prev => prev.filter(p => p.id !== id));
    } else if (category === 'watches') {
      setWatchesState(prev => prev.filter(p => p.id !== id));
    } else if (category === 'furniture') {
      setFurnitureState(prev => prev.filter(p => p.id !== id));
    } else if (category === 'kids') {
      setKidsState(prev => prev.filter(p => p.id !== id));
    }
    setNotification({ show: true, message: 'Product deleted successfully!' });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const updateProduct = (updatedProduct) => {
    const { id, category } = updatedProduct;
    const updateInList = (list) => list.map(p => p.id === id ? { ...p, ...updatedProduct } : p);
    if (category === 'smartphones') {
      setSmartphonesState(updateInList);
    } else if (category === 'watches') {
      setWatchesState(updateInList);
    } else if (category === 'furniture') {
      setFurnitureState(updateInList);
    } else if (category === 'kids') {
      setKidsState(updateInList);
    }
    setNotification({ show: true, message: 'Product updated successfully!' });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const openAuthModal = (mode) => setAuthModal({ isOpen: true, mode });
  const closeAuthModal = () => setAuthModal({ ...authModal, isOpen: false });

  return (
    <Router>
      <div className="App">
        <Header 
          cartCount={cartCount} 
          favoriteItems={favoriteItems}
          toggleFavorite={toggleFavorite}
          addToCart={addToCart}
          compareCount={compareItems.length}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          openLogin={() => openAuthModal('login')} 
          openSignup={() => openAuthModal('signup')} 
        />
        
        <Routes>
          <Route path="/" element={
            <Home 
              addToCart={addToCart} 
              favoriteItems={favoriteItems}
              compareItems={compareItems}
              toggleFavorite={toggleFavorite}
              toggleCompare={toggleCompare}
              smartphones={smartphonesState}
              watches={watchesState}
              furniture={furnitureState}
              kids={kidsState}
            />
          } />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/categories" element={<AllCategoriesPage />} />
          <Route path="/brands" element={<AllBrandsPage />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/view_detail/:slug" element={<BlogDetails />} />
          <Route path="/category/:slug" element={
            <CategoryProducts 
              addToCart={addToCart} 
              favoriteItems={favoriteItems}
              compareItems={compareItems}
              toggleFavorite={toggleFavorite}
              toggleCompare={toggleCompare}
              smartphones={smartphonesState}
              watches={watchesState}
              furniture={furnitureState}
              kids={kidsState}
            />
          } />
          <Route path="/product/:id" element={
            <ProductDetails 
              addToCart={addToCart} 
              favoriteItems={favoriteItems}
              compareItems={compareItems}
              toggleFavorite={toggleFavorite}
              toggleCompare={toggleCompare}
            />
          } />
          <Route path="/compare" element={
            <Compare 
              compareItems={compareItems} 
              onRemoveFromCompare={removeFromCompare} 
              onAddToCart={addToCart} 
            />
          } />
          <Route path="/cart" element={
            <Cart 
              cartItems={cartItems} 
              removeFromCart={removeFromCart} 
              updateQuantity={updateQuantity} 
              clearCart={clearCart} 
            />
          } />
          <Route path="/checkout" element={
            <Checkout 
              cartItems={cartItems} 
              clearCart={clearCart} 
            />
          } />
          <Route path="/seller/:id" element={
            <SellerProducts 
              addToCart={addToCart} 
              favoriteItems={favoriteItems}
              compareItems={compareItems}
              toggleFavorite={toggleFavorite}
              toggleCompare={toggleCompare}
            />
          } />
          <Route path="/brand/:slug" element={
            <BrandProducts 
              addToCart={addToCart} 
              favoriteItems={favoriteItems}
              compareItems={compareItems}
              toggleFavorite={toggleFavorite}
              toggleCompare={toggleCompare}
            />
          } />
          <Route path="/admin" element={
            currentUser && currentUser.role === 'admin' ? (
              <AdminDashboard 
                smartphones={smartphonesState}
                watches={watchesState}
                furniture={furnitureState}
                kids={kidsState}
                onAddProduct={addProduct}
                onDeleteProduct={deleteProduct}
                onUpdateProduct={updateProduct}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } />
        </Routes>

        {/* Global Notification */}
        {notification.show && (
          <div className="global-notification">
            <div className="notification-content">
              <CheckCircle size={20} color="#28a745" />
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        <Footer />

        <AuthModal 
          isOpen={authModal.isOpen} 
          onClose={closeAuthModal} 
          initialMode={authModal.mode} 
          onLogin={handleLogin}
        />
      </div>
    </Router>
  );
}

export default App;
