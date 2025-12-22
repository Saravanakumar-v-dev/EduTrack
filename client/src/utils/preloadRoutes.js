/**
 * Utility functions for route preloading and management
 */

// Map of routes to their import functions
const routeImports = {
  // Auth Routes
  '/login': () => import('../pages/Login.jsx'),
  '/register': () => import('../pages/Register.jsx'),
  '/reset-password': () => import('../pages/ResetPassword.jsx'),
  '/forgot-password-code': () => import('../pages/ForgotPasswordCode.jsx'),
  
  // Main Application Routes
  '/dashboard': () => import('../pages/Dashboard.jsx'),
  '/profile': () => import('../pages/StudentProfile.jsx'),
  '/analytics': () => import('../pages/Analytics.jsx'),
  '/reports': () => import('../pages/Reports.jsx'),
  '/admin': () => import('../pages/AdminPanel.jsx'),
  
  // Error Pages
  '/404': () => import('../pages/NotFound.jsx'),

  // Shared Components
  'sidebar': () => import('../components/Sidebar.jsx')
};

// Map of route relationships for smart preloading
const relatedRoutes = {
  '/login': ['/register', '/forgot-password-code'],
  '/register': ['/login'],
  '/forgot-password-code': ['/reset-password'],
  '/dashboard': ['/analytics', '/reports', 'sidebar'],
  '/profile': ['sidebar'],
  '/analytics': ['/dashboard', '/reports', 'sidebar'],
  '/reports': ['/dashboard', '/analytics', 'sidebar'],
  '/admin': ['/dashboard', 'sidebar']
};

/**
 * Preloads a route and its related routes
 * @param {string} routePath - The path to preload
 * @param {boolean} [preloadRelated=true] - Whether to preload related routes
 * @returns {Promise<void>}
 */
export const preloadRoute = async (routePath, preloadRelated = true) => {
  try {
    // Preload the main route
    if (routeImports[routePath]) {
      await routeImports[routePath]().catch(error => {
        console.warn(`Failed to preload route ${routePath}:`, error);
      });
    }

    // Preload related routes if enabled
    if (preloadRelated && relatedRoutes[routePath]) {
      const relatedPromises = relatedRoutes[routePath].map(route => 
        routeImports[route]?.().catch(error => {
          console.warn(`Failed to preload related route ${route}:`, error);
        })
      );
      
      // Wait for all related routes to load
      await Promise.all(relatedPromises.filter(Boolean));
    }
  } catch (error) {
    console.warn(`Error in preloadRoute for ${routePath}:`, error);
  }
};

/**
 * Preloads a role's common routes
 * @param {string} role - The user's role ('admin', 'teacher', or 'student')
 */
export const preloadRoleRoutes = (role) => {
  switch (role) {
    case 'admin':
      preloadRoute('/admin');
      preloadRoute('/dashboard');
      break;
    case 'teacher':
      preloadRoute('/dashboard');
      preloadRoute('/analytics');
      break;
    case 'student':
      preloadRoute('/profile');
      break;
    default:
      preloadRoute('/login');
  }
};