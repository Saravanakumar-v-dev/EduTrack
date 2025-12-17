import { matchPath } from 'react-router-dom';

/**
 * Route configuration with access control
 */
export const routeConfig = {
  // Public Routes (no auth required)
  public: [
    '/login',
    '/register',
    '/forgot-password-code',
    '/reset-password',
    '/404',
  ],
  
  // Role-based route access
  roleAccess: {
    admin: [
      '/dashboard',
      '/analytics',
      '/reports',
      '/admin',
      '/profile/:id', // Can view any student's profile
    ],
    teacher: [
      '/dashboard',
      '/analytics',
      '/reports',
      '/profile/:id', // Can view assigned students' profiles
    ],
    student: [
      '/profile', // Can only view own profile
    ],
  },
  
  // Routes that require redirection when authenticated
  redirectWhenAuthed: [
    '/login',
    '/register',
    '/forgot-password-code',
    '/reset-password',
  ],
};

/**
 * Check if a route is public
 * @param {string} path - The route path to check
 * @returns {boolean}
 */
export const isPublicRoute = (path) => {
  // Ensure path is normalized
  const normalizedPath = path.toLowerCase().trim();
  
  // Force login page for root path when not authenticated
  if (normalizedPath === '/' || normalizedPath === '') {
    return true;
  }
  
  return routeConfig.public.some(route => {
    const match = matchPath({ path: route, exact: true }, normalizedPath);
    // Only return true for exact matches
    return match && match.pathname === normalizedPath;
  });
};

/**
 * Check if user has access to a route based on their role
 * @param {string} path - The route path to check
 * @param {string} userRole - The user's role
 * @param {object} userData - The user's data (for checking specific permissions)
 * @returns {boolean}
 */
export const hasRouteAccess = (path, userRole, userData = {}) => {
  // Public routes are always accessible
  if (isPublicRoute(path)) {
    return true;
  }

  // Must have a valid role to access protected routes
  if (!userRole || !routeConfig.roleAccess[userRole]) {
    return false;
  }

  // Check if the path matches any of the allowed routes for the user's role
  const hasAccess = routeConfig.roleAccess[userRole].some(route => {
    const match = matchPath({ path: route, exact: true }, path);
    if (!match) return false;

    // Special case for profile routes
    if (match.pattern.path.includes('/profile')) {
      // Students can only view their own profile
      if (userRole === 'student') {
        return !match.params.id || match.params.id === userData.id;
      }
      // Teachers need to verify if student is in their class
      if (userRole === 'teacher') {
        return userData.assignedStudents?.includes(match.params.id);
      }
    }

    return true;
  });

  return hasAccess;
};

/**
 * Get the default route for a user based on their role
 * @param {string} role - The user's role
 * @returns {string} The default route path
 */
export const getDefaultRoute = (role) => {
  switch (role) {
    case 'admin':
      return '/dashboard';
    case 'teacher':
      return '/dashboard';
    case 'student':
      return '/profile';
    default:
      return '/login';
  }
};

/**
 * Check if user should be redirected when authenticated
 * @param {string} path - The current route path
 * @returns {boolean}
 */
export const shouldRedirectWhenAuthed = (path) => {
  return routeConfig.redirectWhenAuthed.some(route => 
    matchPath({ path: route, exact: true }, path)
  );
};