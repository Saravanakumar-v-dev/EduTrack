import express from 'express';
// Note: router is created as a function of the express module
const router = express.Router(); 

// Import Middleware
import { protect, authorize } from '../middleware/authMiddleware.js';

// Import Controller Functions 
import { 
    getOverallPerformanceReport, 
    getClassAttendanceReport, 
    getStudentGradeHistory
} from '../controllers/reportController.js';


const ALLOWED_ROLES = ['admin', 'teacher'];


// @route   GET /api/reports/performance/overall
// @access  Private/Admin, Teacher
router.get(
    '/performance/overall', 
    protect, 
    authorize(ALLOWED_ROLES), 
    getOverallPerformanceReport
);


// @route   GET /api/reports/attendance/class
// @access  Private/Admin, Teacher
router.get(
    '/attendance/class', 
    protect, 
    authorize(ALLOWED_ROLES), 
    getClassAttendanceReport
);


// @route   GET /api/reports/grades/:id
// @access  Private/Admin, Teacher
router.get(
    '/grades/:id', 
    protect, 
    authorize(ALLOWED_ROLES), 
    getStudentGradeHistory
);


// CRITICAL FIX: Export the router using 'export default'
export default router;