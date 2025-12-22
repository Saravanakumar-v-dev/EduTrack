import express from 'express';
const router = express.Router(); 

// Import Middleware (Ensure authMiddleware.js exists)
import { protect, authorize } from '../middleware/authMiddleware.js';

// Import Controller Functions (Ensure userController.js exists)
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
    '/', 
    protect, 
    authorize(ADMIN_ROLE), 
    getAllUsers
);

// @route   GET /api/users/:id
// @desc    Get user by ID 
// @access  Private/Admin
router.get(
    '/:id', 
    protect, 
    authorize(ADMIN_ROLE), 
    getUserById
);

// ... (Other routes like .put('/:id') and .delete('/:id') go here)

export default router;