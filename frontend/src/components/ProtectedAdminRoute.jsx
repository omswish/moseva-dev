import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Route wrapper that checks for authentication and admin role before rendering children
 */
export default function ProtectedAdminRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.auth.user || {});

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin' && role !== 'superadmin') {
    // Could show a Forbidden page, but redirect to dashboard for simplicity
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
