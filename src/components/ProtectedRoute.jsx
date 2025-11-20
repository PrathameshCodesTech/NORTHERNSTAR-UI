// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authAPI.isAuthenticated();
  
  if (!isAuthenticated) {
    // User not logged in - redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // User is authenticated - render the protected component
  return children;
};

export default ProtectedRoute;
