import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { smartphones, watches, furniture, kids } from '../data/dummyData';

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

// ─── Custom hook ──────────────────────────────────────────────────────────────
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
};

// ─── localStorage helpers ────────────────────────────────────────────────────
const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded or private browsing — ignore */ }
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {

  // ── Toast System (defined FIRST so all other callbacks can reference showToastRef) ─
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  // Use a stable ref so toast calls inside useCallback closures are always fresh
  const showToastRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  // Keep ref in sync
  showToastRef.current = showToast;

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Theme (dark mode) ──────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('eshop_theme');
    if (stored) return stored === 'dark';
    return false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    saveToStorage('eshop_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDarkMode = useCallback(() => setIsDark(prev => !prev), []);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const API_URL = 'http://localhost:5001/api/auth';

  // Auto-verify session on mount
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('eshop_token');
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setCurrentUser(data.user);
        } else {
          localStorage.removeItem('eshop_token');
        }
      } catch (err) {
        console.error('Session verification failed:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    verifyUser();
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!data.success) {
        // If unverified, return detailed verified status to trigger OTP verification modal
        if (data.isVerified === false) {
          showToastRef.current?.(data.message, 'warning');
          return { success: false, isVerified: false, email: data.email, otp: data.otp };
        }
        showToastRef.current?.(data.message || 'Login failed', 'error');
        return false;
      }
      localStorage.setItem('eshop_token', data.token);
      setCurrentUser(data.user);
      showToastRef.current?.(`Welcome back, ${data.user.role === 'admin' ? 'Store Owner' : data.user.name}!`, 'success');
      return { success: true };
    } catch (err) {
      showToastRef.current?.('Server connection error. Please try again.', 'error');
      return false;
    }
  }, []);

  const handleRegister = useCallback(async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!data.success) {
        showToastRef.current?.(data.message || 'Registration failed', 'error');
        return false;
      }
      showToastRef.current?.(data.message || 'OTP sent successfully!', 'success');
      return { success: true, isVerified: false, email: data.email, otp: data.otp };
    } catch (err) {
      showToastRef.current?.('Server connection error. Please try again.', 'error');
      return false;
    }
  }, []);

  const handleGoogleLogin = useCallback(async (idToken) => {
    try {
      const res = await fetch(`${API_URL}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json();
      if (!data.success) {
        showToastRef.current?.(data.message || 'Google Login failed', 'error');
        return false;
      }
      localStorage.setItem('eshop_token', data.token);
      setCurrentUser(data.user);
      showToastRef.current?.(`Welcome back, ${data.user.name}!`, 'success');
      return true;
    } catch (err) {
      showToastRef.current?.('Google authentication server connection error.', 'error');
      return false;
    }
  }, []);

  const handleForgotPassword = useCallback(async (email) => {
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!data.success) {
        showToastRef.current?.(data.message || 'Forgot password failed', 'error');
        return null;
      }
      showToastRef.current?.(data.message || 'OTP sent successfully!', 'success');
      return { success: true, email: data.email, otp: data.otp };
    } catch (err) {
      showToastRef.current?.('Server connection error. Please try again.', 'error');
      return null;
    }
  }, []);

  const handleVerifyOTP = useCallback(async (email, otp, type) => {
    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, type })
      });
      const data = await res.json();
      if (!data.success) {
        showToastRef.current?.(data.message || 'OTP verification failed', 'error');
        return { success: false, message: data.message };
      }
      
      if (type === 'verification') {
        localStorage.setItem('eshop_token', data.token);
        setCurrentUser(data.user);
        showToastRef.current?.(`Welcome, ${data.user.name}! Account verified and logged in.`, 'success');
      } else {
        showToastRef.current?.('OTP verified successfully! Please enter your new password.', 'success');
      }
      return { success: true, resetToken: data.resetToken };
    } catch (err) {
      showToastRef.current?.('Server connection error. Please try again.', 'error');
      return { success: false, message: 'Server connection error.' };
    }
  }, []);

  const handleResendOTP = useCallback(async (email, type) => {
    try {
      const res = await fetch(`${API_URL}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type })
      });
      const data = await res.json();
      if (!data.success) {
        showToastRef.current?.(data.message || 'Failed to resend code', 'error');
        return { success: false };
      }
      showToastRef.current?.(data.message || 'Verification code resent successfully!', 'success');
      return { success: true, otp: data.otp };
    } catch (err) {
      showToastRef.current?.('Server connection error. Please try again.', 'error');
      return { success: false };
    }
  }, []);

  const handleResetPassword = useCallback(async (resetToken, password) => {
    try {
      const res = await fetch(`${API_URL}/reset-password/${resetToken}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!data.success) {
        showToastRef.current?.(data.message || 'Reset password failed', 'error');
        return false;
      }
      localStorage.setItem('eshop_token', data.token);
      setCurrentUser(data.user);
      showToastRef.current?.('Password reset successful! You are now logged in.', 'success');
      return true;
    } catch (err) {
      showToastRef.current?.('Server connection error. Please try again.', 'error');
      return false;
    }
  }, []);

  const handleSignOut = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('eshop_token');
    showToastRef.current?.('Logged out successfully!', 'info');
  }, []);

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // ── Cart ───────────────────────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState(() => loadFromStorage('eshop_cart', []));

  useEffect(() => {
    saveToStorage('eshop_cart', cartItems);
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToastRef.current?.(`"${product.title}" added to cart!`, 'success');
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    saveToStorage('eshop_cart', []);
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  // ── Favorites (Wishlist) ───────────────────────────────────────────────────
  const [favoriteItems, setFavoriteItems] = useState(() => loadFromStorage('eshop_favorites', []));

  useEffect(() => {
    saveToStorage('eshop_favorites', favoriteItems);
  }, [favoriteItems]);

  const toggleFavorite = useCallback((product) => {
    setFavoriteItems(prev => {
      const isFav = prev.some(item => item.id === product.id);
      if (isFav) {
        showToastRef.current?.('Removed from wishlist', 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        showToastRef.current?.(`"${product.title}" added to wishlist!`, 'success');
        return [...prev, product];
      }
    });
  }, []);

  const isFavorite = useCallback((id) => favoriteItems.some(item => item.id === id), [favoriteItems]);

  // ── Compare ────────────────────────────────────────────────────────────────
  const [compareItems, setCompareItems] = useState([]);

  const toggleCompare = useCallback((product) => {
    setCompareItems(prev => {
      const comparing = prev.some(item => item.id === product.id);
      if (comparing) {
        showToastRef.current?.('Removed from comparison', 'info');
        return prev.filter(item => item.id !== product.id);
      }
      if (prev.length >= 4) {
        showToastRef.current?.('You can compare up to 4 products only', 'warning');
        return prev;
      }
      showToastRef.current?.('Added to comparison!', 'success');
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((id) => {
    setCompareItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const isComparing = useCallback((id) => compareItems.some(item => item.id === id), [compareItems]);

  // ── Products (Admin CRUD) ──────────────────────────────────────────────────
  const [smartphonesState, setSmartphonesState] = useState(smartphones);
  const [watchesState, setWatchesState] = useState(watches);
  const [furnitureState, setFurnitureState] = useState(furniture);
  const [kidsState, setKidsState] = useState(kids);

  const addProduct = useCallback((newProduct) => {
    const productWithId = {
      ...newProduct,
      id: Date.now(),
      rating: 5.0,
      image: newProduct.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&fit=crop'
    };
    if (newProduct.category === 'smartphones') setSmartphonesState(prev => [productWithId, ...prev]);
    else if (newProduct.category === 'watches') setWatchesState(prev => [productWithId, ...prev]);
    else if (newProduct.category === 'furniture') setFurnitureState(prev => [productWithId, ...prev]);
    else if (newProduct.category === 'kids') setKidsState(prev => [productWithId, ...prev]);
    showToastRef.current?.('Product added successfully!', 'success');
  }, []);

  const deleteProduct = useCallback((id, category) => {
    if (category === 'smartphones') setSmartphonesState(prev => prev.filter(p => p.id !== id));
    else if (category === 'watches') setWatchesState(prev => prev.filter(p => p.id !== id));
    else if (category === 'furniture') setFurnitureState(prev => prev.filter(p => p.id !== id));
    else if (category === 'kids') setKidsState(prev => prev.filter(p => p.id !== id));
    showToastRef.current?.('Product deleted successfully!', 'success');
  }, []);

  const updateProduct = useCallback((updatedProduct) => {
    const { id, category } = updatedProduct;
    const updateInList = (list) => list.map(p => p.id === id ? { ...p, ...updatedProduct } : p);
    if (category === 'smartphones') setSmartphonesState(updateInList);
    else if (category === 'watches') setWatchesState(updateInList);
    else if (category === 'furniture') setFurnitureState(updateInList);
    else if (category === 'kids') setKidsState(updateInList);
    showToastRef.current?.('Product updated successfully!', 'success');
  }, []);

  // ── Memoized context value (prevents ALL consumers from re-rendering on unrelated state changes) ─
  const value = useMemo(() => ({
    // theme
    isDark,
    toggleDarkMode,
    // auth
    currentUser,
    authLoading,
    authModal,
    handleLogin,
    handleRegister,
    handleGoogleLogin,
    handleForgotPassword,
    handleVerifyOTP,
    handleResendOTP,
    handleResetPassword,
    handleSignOut,
    openAuthModal,
    closeAuthModal,
    // cart
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    // favorites
    favoriteItems,
    toggleFavorite,
    isFavorite,
    // compare
    compareItems,
    toggleCompare,
    removeFromCompare,
    isComparing,
    // products
    smartphonesState,
    watchesState,
    furnitureState,
    kidsState,
    addProduct,
    deleteProduct,
    updateProduct,
    // toasts
    toasts,
    showToast,
    dismissToast,
  }), [
    isDark, toggleDarkMode,
    currentUser, authLoading, authModal, handleLogin, handleRegister, handleGoogleLogin, handleForgotPassword, handleVerifyOTP, handleResendOTP, handleResetPassword, handleSignOut, openAuthModal, closeAuthModal,
    cartItems, cartCount, addToCart, removeFromCart, updateQuantity, clearCart,
    favoriteItems, toggleFavorite, isFavorite,
    compareItems, toggleCompare, removeFromCompare, isComparing,
    smartphonesState, watchesState, furnitureState, kidsState, addProduct, deleteProduct, updateProduct,
    toasts, showToast, dismissToast,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
