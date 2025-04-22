import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, children }) {
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;