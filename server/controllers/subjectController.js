import asyncHandler from 'express-async-handler';
// CRITICAL: Ensure these models exist and use 'export default'
import Subject from '../models/Subject.js';
import User from '../models/User.js'; // To reference the teacher

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private/Admin, Teacher
export const createSubject = asyncHandler(async (req, res) => {
    const { name, code, description, teacherId } = req.body;

    if (!name || !code) {
        res.status(400);
        throw new Error('Please include subject name and code.');
    }

    const subjectExists = await Subject.findOne({ code });

    if (subjectExists) {
        res.status(400);
        throw new Error('A subject with this code already exists.');
    }

    let teacher = null;
    if (teacherId) {
        teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== 'teacher') {
            res.status(404);
            throw new Error('Assigned teacher not found or is not a teacher.');
        }
    }

    const subject = await Subject.create({
        name,
        code,
        description,
        teacher: teacher ? teacher._id : undefined,
    });

    res.status(201).json({
        message: 'Subject created successfully.',
        data: subject,
    });
});


// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
export const getAllSubjects = asyncHandler(async (req, res) => {
    const subjects = await Subject.find({}).populate('teacher', 'name email');

    res.status(200).json(subjects);
});


// @desc    Get single subject by ID
// @route   GET /api/subjects/:id
// @access  Private
export const getSubjectById = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id).populate('teacher', 'name email');

    if (subject) {
        res.status(200).json(subject);
    } else {
        res.status(404);
        throw new Error('Subject not found.');
    }
});


// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin, Teacher
export const updateSubject = asyncHandler(async (req, res) => {
    const { name, code, description, teacherId } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
        res.status(404);
        throw new Error('Subject not found.');
    }

    // Update fields
    subject.name = name || subject.name;
    subject.code = code || subject.code;
    subject.description = description || subject.description;
    
    // Handle teacher update
    if (teacherId) {
        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== 'teacher') {
             res.status(404);
             throw new Error('Assigned teacher not found or is not a teacher.');
        }
        subject.teacher = teacher._id;
    } else if (teacherId === null) {
        subject.teacher = undefined; // Allow unassigning teacher
    }
    
    const updatedSubject = await subject.save();

    res.status(200).json({
        message: 'Subject updated successfully.',
        data: updatedSubject,
    });
});


// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
export const deleteSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
        res.status(404);
        throw new Error('Subject not found.');
    }

    // You should add logic here to check if the subject is currently in use (e.g., linked to grades or students)

    await Subject.deleteOne({ _id: subject._id });

    res.status(200).json({ 
        message: 'Subject removed successfully.' 
    });
});

// All functions are correctly exported using 'export const'.