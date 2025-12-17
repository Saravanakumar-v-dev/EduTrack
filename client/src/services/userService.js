import express from 'express';
const router = express.Router(); 

// Import Middleware
import { protect, authorize } from '../middleware/authMiddleware.js';

// Import Controller Functions (Assumes they are exported as named exports)
import { 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser 
} from '../controllers/userController.js';

const ADMIN_ROLE = ['admin'];

// @route   GET /api/users
// @desc    Get all users 
// @access  Private/Admin
// CRITICAL FIX: The path here MUST be '/', as the prefix /api/users is in server.js
router.get(
    '/', // This handles GET /api/users
    protect, 
    authorize(ADMIN_ROLE), 
    getAllUsers
);

// @route   GET /api/users/:id
// @desc    Get user by ID 
// @access  Private/Admin
router.get(
    '/:id', // This handles GET /api/users/:id
    protect, 
    authorize(ADMIN_ROLE), 
    getUserById
);

// Add PUT and DELETE routes for ID
router.route('/:id')
    .put(protect, authorize(ADMIN_ROLE), updateUser)
    .delete(protect, authorize(ADMIN_ROLE), deleteUser);

export default router;