import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';
import AuthModal from './components/common/AuthModal';
import PageLoader from './components/common/PageLoader';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

// ── Eager-loaded pages (Instant navigation transition) ──────────────────────
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
import Profile from './pages/Profile';
import PolicyPage from './pages/PolicyPage';
import AffiliatePage from './pages/AffiliatePage';


// ── Protected Admin Route ──────────────────────────────────────────────────
const AdminRoute = () => {
  const { currentUser, smartphonesState, watchesState, furnitureState, kidsState,
          fashionState, electronicsState, digitalProductState, homeAppliancesState,
          vegetableState, decorState, booksState,
          addProduct, deleteProduct, updateProduct } = useApp();

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminDashboard
      smartphones={smartphonesState}
      watches={watchesState}
      furniture={furnitureState}
      kids={kidsState}
      fashion={fashionState}
      electronics={electronicsState}
      digitalProduct={digitalProductState}
      homeAppliances={homeAppliancesState}
      vegetables={vegetableState}
      decor={decorState}
      books={booksState}
      onAddProduct={addProduct}
      onDeleteProduct={deleteProduct}
      onUpdateProduct={updateProduct}
    />
  );
};

// ── App Shell ──────────────────────────────────────────────────────────────
const AppShell = () => {
  const { authModal, closeAuthModal, handleLogin } = useApp();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminPath && <Header />}

      <Suspense fallback={<PageLoader count={8} />}>
        <Routes>
          <Route path="/"                          element={<Home />} />
          <Route path="/contact"                   element={<ContactUs />} />
          <Route path="/sellers"                   element={<Sellers />} />
          <Route path="/categories"                element={<AllCategoriesPage />} />
          <Route path="/brands"                    element={<AllBrandsPage />} />
          <Route path="/faqs"                      element={<FAQPage />} />
          <Route path="/blogs"                     element={<Blogs />} />
          <Route path="/blogs/view_detail/:slug"   element={<BlogDetails />} />
          <Route path="/category/:slug"            element={<CategoryProducts />} />
          <Route path="/product/:id"               element={<ProductDetails />} />
          <Route path="/compare"                   element={<Compare />} />
          <Route path="/cart"                      element={<Cart />} />
          <Route path="/affiliate"                 element={<AffiliatePage />} />
          <Route path="/return-policy"             element={<PolicyPage title="Return Policy" content={["If you are not entirely satisfied with your purchase, we're here to help.", "You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it."]} />} />
          <Route path="/shipping-policy"           element={<PolicyPage title="Shipping Policy" content={["All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays.", "If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery."]} />} />
          <Route path="/privacy-policy"            element={<PolicyPage title="Privacy Policy" content={["Your privacy is important to us. It is MarketHub's policy to respect your privacy regarding any information we may collect from you across our website.", "We only ask for personal information when we truly need it to provide a service to you."]} />} />
          <Route path="/terms-conditions"          element={<PolicyPage title="Terms & Conditions" content={["By accessing this website we assume you accept these terms and conditions. Do not continue to use MarketHub if you do not agree to take all of the terms and conditions stated on this page.", "The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements."]} />} />
          <Route path="/about"                     element={<PolicyPage title="About Us" content={["MarketHub is a leading eCommerce platform dedicated to providing the best shopping experience.", "Our mission is to offer high-quality products at competitive prices, ensuring customer satisfaction above all else."]} />} />
          <Route path="/checkout"                  element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/seller/:id"                element={<SellerProducts />} />
          <Route path="/brand/:slug"               element={<BrandProducts />} />
          <Route path="/admin"                     element={
            <ProtectedRoute adminOnly={true}>
              <AdminRoute />
            </ProtectedRoute>
          } />
          <Route path="/profile"                   element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/profile/track/:trackOrderId" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>

      {!isAdminPath && <Footer />}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.mode}
        onLogin={handleLogin}
      />

      {/* Global Toast Stack */}
      <Toast />

      {/* Dynamic Scroll to Top Progress Button */}
      <ScrollToTop />
    </div>
  );
};

// ── Root ────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </Router>
  );
}

export default App;
