import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import PageLoader from './PageLoader';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, authLoading, openAuthModal } = useApp();

  useEffect(() => {
    // If auto-session verification is complete and no user is active, trigger Login Modal
    if (!authLoading && !currentUser) {
      openAuthModal('login');
    }
  }, [authLoading, currentUser, openAuthModal]);

  // While checking backend session /me, render the loading skeletons
  if (authLoading) {
    return <PageLoader count={4} />;
  }

  // No user active - redirect safely to Home
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Admin access restriction check
  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
