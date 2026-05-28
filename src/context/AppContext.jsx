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
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    saveToStorage('eshop_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDarkMode = useCallback(() => setIsDark(prev => !prev), []);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem('eshop_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  const handleLogin = useCallback((user) => {
    setCurrentUser(user);
    sessionStorage.setItem('eshop_user', JSON.stringify(user));
    showToastRef.current?.(`Welcome back, ${user.role === 'admin' ? 'Store Owner' : user.name}!`, 'success');
  }, []);

  const handleSignOut = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem('eshop_user');
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
    authModal,
    handleLogin,
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
    currentUser, authModal, handleLogin, handleSignOut, openAuthModal, closeAuthModal,
    cartItems, cartCount, addToCart, removeFromCart, updateQuantity, clearCart,
    favoriteItems, toggleFavorite, isFavorite,
    compareItems, toggleCompare, removeFromCompare, isComparing,
    smartphonesState, watchesState, furnitureState, kidsState, addProduct, deleteProduct, updateProduct,
    toasts, showToast, dismissToast,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
