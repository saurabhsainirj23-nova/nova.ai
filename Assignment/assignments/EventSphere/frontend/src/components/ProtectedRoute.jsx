import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoadingContainer.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    // Debug authentication state
    console.log('ProtectedRoute - Auth State:', { isAuthenticated, loading, user });
    console.log('LocalStorage token:', localStorage.getItem('token'));
    console.log('LocalStorage user:', localStorage.getItem('user'));
  }, [isAuthenticated, loading, user]);

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading-container">Loading authentication...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  console.log('Authentication successful, rendering protected content');
  // Return children if provided, otherwise use Outlet for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
