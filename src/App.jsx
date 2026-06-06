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
