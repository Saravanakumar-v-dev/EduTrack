import asyncHandler from 'express-async-handler';
import Mark from '../models/Mark.js'; // Ensure Mark.js uses export default
import mongoose from 'mongoose';

// @desc    CREATE a new mark record
export const createMark = asyncHandler(async (req, res) => {
    const { student, subject, score, examType } = req.body;
    if (!student || !subject || score === undefined || !examType) {
        res.status(400); throw new Error('Missing required fields.');
    }
    if (!req.user || !req.user.id) { // req.user comes from 'protect' middleware
        res.status(401); throw new Error('Not authenticated.');
    }

    try {
        const mark = await Mark.create({
            student, subject, score, examType, recordedBy: req.user.id,
        });
        res.status(201).json({ success: true, data: mark, message: 'Mark recorded.' });
    } catch (error) {
        if (error.code === 11000) { res.status(400); throw new Error('Duplicate mark entry.'); }
        res.status(400); throw new Error(error.message || 'Error recording mark.');
    }
});

// @desc    READ all marks
export const getMarks = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.studentId) filter.student = req.query.studentId;
    if (req.query.subjectId) filter.subject = req.query.subjectId;
    // Populate linked fields for better context
    const marks = await Mark.find(filter).populate('student subject recordedBy', 'name email code');
    res.status(200).json({ success: true, count: marks.length, data: marks });
});

// @desc    READ single mark by ID
export const getMark = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { res.status(400); throw new Error('Invalid Mark ID'); }
    const mark = await Mark.findById(req.params.id).populate('student subject', 'name email code');
    if (!mark) { res.status(404); throw new Error('Mark not found.'); }
    res.status(200).json({ success: true, data: mark });
});

// @desc    UPDATE a mark record
export const updateMark = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { res.status(400); throw new Error('Invalid Mark ID'); }
    // Only allow updating certain fields, like score
    const { score } = req.body;
    const mark = await Mark.findByIdAndUpdate(req.params.id, { score }, { new: true, runValidators: true });
    if (!mark) { res.status(404); throw new Error('Mark not found.'); }
    res.status(200).json({ success: true, data: mark, message: 'Mark updated.' });
});

// @desc    DELETE a mark record
export const deleteMark = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { res.status(400); throw new Error('Invalid Mark ID'); }
    const mark = await Mark.findById(req.params.id);
    if (!mark) { res.status(404); throw new Error('Mark not found.'); }
    await Mark.deleteOne({ _id: mark._id });
    res.status(200).json({ success: true, message: 'Mark deleted.' });
});

