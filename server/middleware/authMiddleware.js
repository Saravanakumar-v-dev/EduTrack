import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

/**
 * Middleware to protect routes - accepts token from Authorization header OR cookie.
 */
export const protect = asyncHandler(async (req, res, next) => {
  try {
    let token = null;

    // 1) Header (preferred if frontend stores token in localStorage)
    const authHeader = req.headers.authorization || '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2) Fallback to cookie (if backend set httpOnly cookie on login)
    if (!token && req.cookies) {
      token = req.cookies.jwt || req.cookies.token || null; // check common cookie names
    }

    if (!token) {
      // helpful debug log
      console.warn('Protect middleware: no token found. headers.authorization=', authHeader ? '[present]' : '[none]', 'cookies=', !!req.cookies);
      res.status(401);
      throw new Error('Not authorized, no token provided.');
    }

    // 3) Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('Protect middleware: token verification failed:', err.message);
      res.status(401);
      throw new Error('Not authorized, token invalid or expired.');
    }

    // 4) Find user: try multiple possible id fields from payload
    const userId = decoded?.id || decoded?._id || decoded?.userId || decoded?.user?.id;
    if (!userId) {
      console.warn('Protect middleware: token did not contain recognizable user id. decoded=', decoded);
      res.status(401);
      throw new Error('Not authorized, token payload malformed.');
    }

    // 5) Attach user to request (exclude password)
    const user = await User.findById(userId).select('-password');
    if (!user) {
      console.warn('Protect middleware: user not found for id:', userId);
      res.status(401);
      throw new Error('Not authorized, user not found.');
    }

    req.user = user;
    next();
  } catch (err) {
    // rethrow to be handled by express-async-handler and your error middleware
    throw err;
  }
});

/**
 * authorize(allowedRoles)
 * Example: authorize(['admin', 'teacher'])
 */
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized.');
    }
    // support single string role as well
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!allowed.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role '${req.user.role}' is not authorized to access this route.`);
    }
    next();
  };
};
