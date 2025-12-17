import express from 'express';
// Note: router is created as a function of the express module
const router = express.Router(); 

// Import Middleware
import { protect, authorize } from '../middleware/authMiddleware.js';

// Import Controller Functions 
import { 
    getAllStudents, 
    getStudentById, 
    updateStudentProfile, 
    deleteStudent 
} from '../controllers/studentController.js';


// Define roles that can manage or view student data (e.g., admin and teacher)
const ADMIN_TEACHER = ['admin', 'teacher'];


// @route   GET /api/students
// @desc    Get all student profiles (Admin/Teacher only)
// @access  Private
router.get(
    '/', 
    protect, 
    authorize(ADMIN_TEACHER), 
    getAllStudents
);

// @route   GET /api/students/:id
// @desc    Get single student profile
// @access  Private (Self or Admin/Teacher)
router.get(
    '/:id', 
    protect, 
    getStudentById
);

// @route   PUT /api/students/:id
// @desc    Update student profile
// @access  Private (Self or Admin/Teacher)
router.put(
    '/:id', 
    protect, 
    updateStudentProfile
);

// @route   DELETE /api/students/:id
// @desc    Delete student profile
// @access  Private (Admin only)
router.delete(
    '/:id', 
    protect, 
    authorize(['admin']), 
    deleteStudent
);


// CRITICAL FIX: Export the router using 'export default'
export default router;