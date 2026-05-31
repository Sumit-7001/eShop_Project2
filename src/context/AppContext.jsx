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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/auth';
  const BASE_API_URL = API_URL.replace('/api/auth', '/api') || 'http://localhost:5001/api';

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

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('eshop_token');
    if (!token) return null;
    try {
      const res = await fetch(`${BASE_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        return data.user;
      }
      return null;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return null;
    }
  }, [BASE_API_URL]);

  const saveAddress = useCallback(async (addressData) => {
    const token = localStorage.getItem('eshop_token');
    if (!token) {
      showToastRef.current?.('Please login to save shipping address.', 'error');
      return false;
    }
    try {
      const res = await fetch(`${BASE_API_URL}/users/profile/addresses`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });
      const data = await res.json();
      if (!data.success) {
        showToastRef.current?.(data.message || 'Failed to save address', 'error');
        return false;
      }
      setCurrentUser(prev => prev ? { ...prev, savedAddresses: data.savedAddresses } : null);
      showToastRef.current?.(data.message || 'Address saved successfully!', 'success');
      return true;
    } catch (err) {
      showToastRef.current?.('Server connection error. Please try again.', 'error');
      return false;
    }
  }, [BASE_API_URL]);

  const deleteAddress = useCallback(async (addressId) => {
    const token = localStorage.getItem('eshop_token');
    if (!token) return false;
    try {
      const res = await fetch(`${BASE_API_URL}/users/profile/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.success) {
        showToastRef.current?.(data.message || 'Failed to delete address', 'error');
        return false;
      }
      setCurrentUser(prev => prev ? { ...prev, savedAddresses: data.savedAddresses } : null);
      showToastRef.current?.('Address deleted successfully!', 'success');
      return true;
    } catch (err) {
      showToastRef.current?.('Server connection error.', 'error');
      return false;
    }
  }, [BASE_API_URL]);

  const createOrder = useCallback(async (orderData) => {
    const token = localStorage.getItem('eshop_token');
    if (!token) {
      showToastRef.current?.('Please log in to place your order.', 'error');
      return null;
    }
    try {
      const res = await fetch(`${BASE_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (!data.success) {
        showToastRef.current?.(data.message || 'Failed to place order.', 'error');
        return null;
      }
      showToastRef.current?.('Order placed successfully!', 'success');
      clearCart();
      return data.order;
    } catch (err) {
      showToastRef.current?.('Server connection error. Please try again.', 'error');
      return null;
    }
  }, [BASE_API_URL]);

  const fetchUserOrders = useCallback(async () => {
    const token = localStorage.getItem('eshop_token');
    if (!token) return [];
    try {
      const res = await fetch(`${BASE_API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        return data.orders;
      }
      return [];
    } catch (err) {
      console.error('Error fetching past orders:', err);
      return [];
    }
  }, [BASE_API_URL]);

  const fetchOrderTracking = useCallback(async (orderId) => {
    const token = localStorage.getItem('eshop_token');
    if (!token) return null;
    try {
      const res = await fetch(`${BASE_API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        return data.order;
      }
      return null;
    } catch (err) {
      console.error('Error fetching order tracking details:', err);
      return null;
    }
  }, [BASE_API_URL]);

  const fetchAdminOrders = useCallback(async () => {
    const token = localStorage.getItem('eshop_token');
    if (!token) return [];
    try {
      const res = await fetch(`${BASE_API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.orders) {
        return data.orders;
      }
      return [];
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      return [];
    }
  }, [BASE_API_URL]);

  const fetchAdminUsers = useCallback(async () => {
    const token = localStorage.getItem('eshop_token');
    if (!token) return [];
    try {
      const res = await fetch(`${BASE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.users) {
        return data.users;
      }
      return [];
    } catch (err) {
      console.error('Error fetching admin users:', err);
      return [];
    }
  }, [BASE_API_URL]);

  const updateAdminOrderStatus = useCallback(async (orderId, status) => {
    const token = localStorage.getItem('eshop_token');
    if (!token) {
      showToastRef.current?.('Unauthorized action.', 'error');
      return false;
    }
    try {
      const res = await fetch(`${BASE_API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToastRef.current?.('Order status updated successfully!', 'success');
        return true;
      } else {
        showToastRef.current?.(data.message || 'Failed to update order status.', 'error');
        return false;
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      showToastRef.current?.('Server connection error.', 'error');
      return false;
    }
  }, [BASE_API_URL]);

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

  // ── Products (Hybrid CRUD: local catalog + MongoDB persistence) ───────────
  const [smartphonesState, setSmartphonesState] = useState(smartphones);
  const [watchesState, setWatchesState] = useState(watches);
  const [furnitureState, setFurnitureState] = useState(furniture);
  const [kidsState, setKidsState] = useState(kids);

  // Fetch only custom products from MongoDB on load and merge
  useEffect(() => {
    const fetchCustomProducts = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/products`);
        const data = await res.json();
        if (data.success && data.products) {
          const customSmartphones = data.products.filter(p => p.category === 'smartphones');
          const customWatches = data.products.filter(p => p.category === 'watches');
          const customFurniture = data.products.filter(p => p.category === 'furniture');
          const customKids = data.products.filter(p => p.category === 'kids');

          // Prepend custom products to the initial hardcoded catalog, filtering duplicates
          setSmartphonesState(prev => {
            const customFiltered = customSmartphones.filter(cp => !prev.some(p => p.id === cp.id));
            return [...customFiltered, ...prev];
          });
          setWatchesState(prev => {
            const customFiltered = customWatches.filter(cp => !prev.some(p => p.id === cp.id));
            return [...customFiltered, ...prev];
          });
          setFurnitureState(prev => {
            const customFiltered = customFurniture.filter(cp => !prev.some(p => p.id === cp.id));
            return [...customFiltered, ...prev];
          });
          setKidsState(prev => {
            const customFiltered = customKids.filter(cp => !prev.some(p => p.id === cp.id));
            return [...customFiltered, ...prev];
          });
        }
      } catch (err) {
        console.error('Error fetching custom products from database:', err);
      }
    };
    fetchCustomProducts();
  }, [BASE_API_URL]);

  const addProduct = useCallback(async (newProduct) => {
    try {
      const token = localStorage.getItem('eshop_token');
      const res = await fetch(`${BASE_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (data.success && data.product) {
        const addedProduct = data.product;
        if (addedProduct.category === 'smartphones') setSmartphonesState(prev => [addedProduct, ...prev]);
        else if (addedProduct.category === 'watches') setWatchesState(prev => [addedProduct, ...prev]);
        else if (addedProduct.category === 'furniture') setFurnitureState(prev => [addedProduct, ...prev]);
        else if (addedProduct.category === 'kids') setKidsState(prev => [addedProduct, ...prev]);
        showToastRef.current?.('Product added successfully!', 'success');
      } else {
        showToastRef.current?.(data.message || 'Failed to add product.', 'error');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      showToastRef.current?.('Error connecting to backend.', 'error');
    }
  }, [BASE_API_URL]);

  const deleteProduct = useCallback(async (id, category) => {
    try {
      const token = localStorage.getItem('eshop_token');
      const res = await fetch(`${BASE_API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        if (category === 'smartphones') setSmartphonesState(prev => prev.filter(p => p.id !== id));
        else if (category === 'watches') setWatchesState(prev => prev.filter(p => p.id !== id));
        else if (category === 'furniture') setFurnitureState(prev => prev.filter(p => p.id !== id));
        else if (category === 'kids') setKidsState(prev => prev.filter(p => p.id !== id));
        showToastRef.current?.('Product deleted successfully!', 'success');
      } else {
        // Local fallback delete
        if (category === 'smartphones') setSmartphonesState(prev => prev.filter(p => p.id !== id));
        else if (category === 'watches') setWatchesState(prev => prev.filter(p => p.id !== id));
        else if (category === 'furniture') setFurnitureState(prev => prev.filter(p => p.id !== id));
        else if (category === 'kids') setKidsState(prev => prev.filter(p => p.id !== id));
        showToastRef.current?.('Product deleted successfully!', 'success');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      if (category === 'smartphones') setSmartphonesState(prev => prev.filter(p => p.id !== id));
      else if (category === 'watches') setWatchesState(prev => prev.filter(p => p.id !== id));
      else if (category === 'furniture') setFurnitureState(prev => prev.filter(p => p.id !== id));
      else if (category === 'kids') setKidsState(prev => prev.filter(p => p.id !== id));
      showToastRef.current?.('Product deleted successfully!', 'success');
    }
  }, [BASE_API_URL]);

  const updateProduct = useCallback(async (updatedProduct) => {
    const { id, category } = updatedProduct;
    try {
      const token = localStorage.getItem('eshop_token');
      const res = await fetch(`${BASE_API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      });
      const data = await res.json();
      if (data.success && data.product) {
        const updated = data.product;
        const updateInList = (list) => list.map(p => p.id === id ? { ...p, ...updated } : p);
        if (category === 'smartphones') setSmartphonesState(updateInList);
        else if (category === 'watches') setWatchesState(updateInList);
        else if (category === 'furniture') setFurnitureState(updateInList);
        else if (category === 'kids') setKidsState(updateInList);
        showToastRef.current?.('Product updated successfully!', 'success');
      } else {
        // Fallback for local update
        const updateInList = (list) => list.map(p => p.id === id ? { ...p, ...updatedProduct } : p);
        if (category === 'smartphones') setSmartphonesState(updateInList);
        else if (category === 'watches') setWatchesState(updateInList);
        else if (category === 'furniture') setFurnitureState(updateInList);
        else if (category === 'kids') setKidsState(updateInList);
        showToastRef.current?.('Product updated successfully!', 'success');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      const updateInList = (list) => list.map(p => p.id === id ? { ...p, ...updatedProduct } : p);
      if (category === 'smartphones') setSmartphonesState(updateInList);
      else if (category === 'watches') setWatchesState(updateInList);
      else if (category === 'furniture') setFurnitureState(updateInList);
      else if (category === 'kids') setKidsState(updateInList);
      showToastRef.current?.('Product updated successfully!', 'success');
    }
  }, [BASE_API_URL]);

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
    // profile & orders
    fetchUserProfile,
    saveAddress,
    deleteAddress,
    createOrder,
    fetchUserOrders,
    fetchOrderTracking,
    fetchAdminOrders,
    fetchAdminUsers,
    updateAdminOrderStatus,
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
    fetchUserProfile, saveAddress, deleteAddress, createOrder, fetchUserOrders, fetchOrderTracking, fetchAdminOrders, fetchAdminUsers, updateAdminOrderStatus,
    cartItems, cartCount, addToCart, removeFromCart, updateQuantity, clearCart,
    favoriteItems, toggleFavorite, isFavorite,
    compareItems, toggleCompare, removeFromCompare, isComparing,
    smartphonesState, watchesState, furnitureState, kidsState, addProduct, deleteProduct, updateProduct,
    toasts, showToast, dismissToast,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
