const express = require('express');
const router = express.Router();
const { 
    createMark, 
    getMarks, 
    getMark, 
    updateMark, 
    deleteMark 
} = require('../controllers/markController');

// NOTE: You should add protect and authorize middleware here for security

router.route('/')
    .post(createMark) // POST /api/marks
    .get(getMarks); // GET /api/marks

router.route('/:id')
    .get(getMark) // GET /api/marks/:id
    .put(updateMark) // PUT /api/marks/:id
    .delete(deleteMark); // DELETE /api/marks/:id

module.exports = router;