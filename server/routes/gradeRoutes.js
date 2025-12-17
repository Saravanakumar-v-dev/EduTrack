const express = require('express');
const router = express.Router();
const { 
    createGrade, 
    getGrades, 
    getGrade, 
    updateGrade, 
    deleteGrade,
    getGradeReport // Aggregation route
} = require('../controllers/gradeController');

// NOTE: You should add protect and authorize middleware here for security

router.route('/')
    .post(createGrade) // POST /api/grades (Admin only)
    .get(getGrades);   // GET /api/grades (Admin/Teacher)

router.route('/:id')
    .get(getGrade)     // GET /api/grades/:id
    .put(updateGrade)  // PUT /api/grades/:id (Admin only)
    .delete(deleteGrade); // DELETE /api/grades/:id (Admin only)

// Special report route
router.get('/:id/report', getGradeReport); // GET /api/grades/:id/report

module.exports = router;