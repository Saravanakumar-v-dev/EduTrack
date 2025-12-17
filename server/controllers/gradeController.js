import asyncHandler from 'express-async-handler';
import Grade from '../models/Grade.js';
import Mark from '../models/Mark.js';
import mongoose from 'mongoose';

// @desc    CREATE a new Grade/Class (Entity representing a class section)
export const createGrade = asyncHandler(async (req, res) => {
    const { name, year, classTeacher, students } = req.body;
    if (!name || !year) { res.status(400); throw new Error('Grade name and year required.'); }
    try {
        const grade = await Grade.create({ name, year, classTeacher: classTeacher || null, students: students || [] });
        res.status(201).json({ success: true, data: grade, message: 'Grade/Class created.' });
    } catch (error) {
        if (error.code === 11000) { res.status(400); throw new Error('Grade/Class name conflict.'); }
        res.status(400); throw new Error(error.message || 'Error creating grade.');
    }
});

// @desc    READ all Grades/Classes
export const getGrades = asyncHandler(async (req, res) => {
    const grades = await Grade.find({}).populate('classTeacher', 'name email');
    res.status(200).json({ success: true, count: grades.length, data: grades });
});

// @desc    READ single Grade/Class by ID
export const getGrade = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { res.status(400); throw new Error('Invalid ID'); }
    const grade = await Grade.findById(req.params.id).populate('classTeacher students', 'name email');
    if (!grade) { res.status(404); throw new Error('Grade/Class not found.'); }
    res.status(200).json({ success: true, data: grade });
});

// @desc    UPDATE a Grade/Class
export const updateGrade = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { res.status(400); throw new Error('Invalid ID'); }
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!grade) { res.status(404); throw new Error('Grade/Class not found.'); }
    res.status(200).json({ success: true, data: grade, message: 'Grade/Class updated.' });
});

// @desc    DELETE a Grade/Class
export const deleteGrade = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { res.status(400); throw new Error('Invalid ID'); }
    const grade = await Grade.findById(req.params.id);
    if (!grade) { res.status(404); throw new Error('Grade/Class not found.'); }
    await Grade.deleteOne({ _id: grade._id });
    res.status(200).json({ success: true, message: 'Grade/Class deleted.' });
});

// @desc    Get aggregated performance report for a specific Grade/Class
export const getGradeReport = asyncHandler(async (req, res) => {
     const gradeId = req.params.id;
     if (!mongoose.Types.ObjectId.isValid(gradeId)) { res.status(400); throw new Error('Invalid Grade ID format'); }

     const grade = await Grade.findById(gradeId).select('students name');
     if (!grade) { res.status(404); throw new Error('Grade/Class not found.'); }

     if (!Array.isArray(grade.students) || grade.students.length === 0) {
        return res.status(200).json({ success: true, gradeName: grade.name, report: [], message: "No students." });
     }

     const report = await Mark.aggregate([ // Using Mark model here
        { $match: { student: { $in: grade.students } } },
        { $group: { _id: '$student', averageScore: { $avg: '$score' } } },
        { $sort: { averageScore: -1 } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'sd' } },
        { $unwind: '$sd' },
        { $project: { _id: 0, studentId: '$_id', name: '$sd.name', avg: { $round: ['$averageScore', 2] } } }
     ]);
     res.status(200).json({ success: true, gradeName: grade.name, report });
});