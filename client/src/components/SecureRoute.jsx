import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { hasRouteAccess, getDefaultRoute, shouldRedirectWhenAuthed, isPublicRoute } from '../utils/routeProtection';
import { preloadRoute } from '../utils/preloadRoutes';
import toast from 'react-hot-toast';

/**
 * SecureRoute wrapper component that handles route protection and redirection
 */
const SecureRoute = ({ children }) => {
  const { user, loading, isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const currentPath = location.pathname;

  // Preload likely next routes
  useEffect(() => {
    if (user?.role) {
      preloadRoute(currentPath).catch(console.error);
    }
  }, [currentPath, user?.role]);

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="loader"></div>
    </div>;
  }

  // Force clear any stale authentication state
  useEffect(() => {
    if (!isLoggedIn && !isPublicRoute(currentPath)) {
      localStorage.removeItem('user');
      sessionStorage.removeItem('redirectPath');
    }
  }, [isLoggedIn, currentPath]);

  // Handle authenticated user trying to access auth pages
  if (isLoggedIn && shouldRedirectWhenAuthed(currentPath)) {
    const defaultRoute = getDefaultRoute(user.role);
    // Clear any stored redirect path to prevent loops
    sessionStorage.removeItem('redirectPath');
    return <Navigate to={defaultRoute} replace />;
  }

  // Handle unauthenticated user trying to access protected routes
  if (!isLoggedIn && !isPublicRoute(currentPath)) {
    // Clear any stale user data
    localStorage.removeItem('user');
    // Store the attempted path for post-login redirect
    if (currentPath !== '/login') {
      sessionStorage.setItem('redirectPath', currentPath);
    }
    toast.error('Please login to access this page');
    return <Navigate to="/login" replace />;
  }

  // Check role-based access for authenticated users
  if (isLoggedIn && !hasRouteAccess(currentPath, user.role, user)) {
    toast.error('You do not have permission to access this page');
    const defaultRoute = getDefaultRoute(user.role);
    return <Navigate to={defaultRoute} replace />;
  }

  // Render the protected route
  return children;
};

export default SecureRoute;