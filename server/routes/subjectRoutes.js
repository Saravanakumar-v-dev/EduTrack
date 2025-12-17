import express from 'express';
// Note: router is created as a function of the express module
const router = express.Router(); 

// Import Middleware
import { protect, authorize } from '../middleware/authMiddleware.js';

// Import Controller Functions 
import { 
    createSubject, 
    getAllSubjects, 
    getSubjectById, 
    updateSubject, 
    deleteSubject 
} from '../controllers/subjectController.js';


// Define roles that can manage subjects (e.g., admin and teacher)
const ADMIN_TEACHER = ['admin', 'teacher'];


// @route   POST /api/subjects
// @desc    Create a new subject
// @access  Private/Admin, Teacher
router.post(
    '/', 
    protect, 
    authorize(ADMIN_TEACHER), 
    createSubject
);

// @route   GET /api/subjects
// @desc    Get all subjects
// @access  Private
router.get(
    '/', 
    protect, 
    getAllSubjects
);

// @route   GET /api/subjects/:id
// @desc    Get single subject by ID
// @access  Private
router.get(
    '/:id', 
    protect, 
    getSubjectById
);

// @route   PUT /api/subjects/:id
// @desc    Update a subject
// @access  Private/Admin, Teacher
router.put(
    '/:id', 
    protect, 
    authorize(ADMIN_TEACHER), 
    updateSubject
);

// @route   DELETE /api/subjects/:id
// @desc    Delete a subject
// @access  Private/Admin
router.delete(
    '/:id', 
    protect, 
    authorize(['admin']), 
    deleteSubject
);


// CRITICAL FIX: Export the router using 'export default'
export default router;