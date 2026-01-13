// server/controllers/markController.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Mark from "../models/Mark.js";

/* ======================================================
   CREATE MARK (TEACHER / ADMIN)
====================================================== */
// @route   POST /api/marks
// @access  Teacher, Admin
export const createMark = asyncHandler(async (req, res) => {
  const { student, subject, score, examType } = req.body;

  if (!student || !subject || score === undefined || !examType) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  if (!["teacher", "admin"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Only teachers or admins can record marks");
  }

  const mark = await Mark.create({
    student,
    subject,
    score,
    examType,
    recordedBy: req.user._id, // 🔑 important for analytics scoping
  });

  res.status(201).json({
    success: true,
    message: "Mark recorded successfully",
    data: mark,
  });
});

/* ======================================================
   BULK CREATE MARKS (TEACHER / ADMIN)
====================================================== */
// @route   POST /api/marks/bulk
// @access  Teacher, Admin
export const bulkCreateMarks = asyncHandler(async (req, res) => {
  const { marks } = req.body; // Array of { student, subject, score, examType }

  if (!marks || !Array.isArray(marks) || marks.length === 0) {
    res.status(400);
    throw new Error("Invalid marks data");
  }

  const marksToInsert = marks.map(m => ({
    ...m,
    recordedBy: req.user._id,
  }));

  // Use bulkWrite for better performance if needed, or insertMany
  // Using insertMany but ignoring duplicates might be tricky if we want to update.
  // For now, let's use insertMany and let it fail on duplicates or use ordered: false

  try {
    const createdMarks = await Mark.insertMany(marksToInsert, { ordered: false });
    res.status(201).json({
      success: true,
      message: `${createdMarks.length} marks uploaded successfully`,
      data: createdMarks,
    });
  } catch (error) {
    // Handle partial success if ordered: false, or just return error
    if (error.code === 11000) {
      res.status(207).json({ // 207 Multi-Status
        success: true,
        message: "Some marks were duplicates and skipped",
        count: error.result?.nInserted || 0
      });
    } else {
      throw error;
    }
  }
});

/* ======================================================
   GET MARKS (ROLE AWARE)
====================================================== */
// @route   GET /api/marks
// @access  Student (own), Teacher (own students), Admin (all)
export const getMarks = asyncHandler(async (req, res) => {
  const filter = {};

  // Student → only their marks
  if (req.user.role === "student") {
    filter.student = req.user._id;
  }

  // Teacher → only marks they uploaded
  if (req.user.role === "teacher") {
    filter.recordedBy = req.user._id;
  }

  // Admin → optional filters
  if (req.user.role === "admin") {
    if (req.query.studentId) filter.student = req.query.studentId;
    if (req.query.subjectId) filter.subject = req.query.subjectId;
  }

  const marks = await Mark.find(filter)
    .populate("student", "name email")
    .populate("subject", "name code")
    .populate("recordedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: marks.length,
    data: marks,
  });
});

/* ======================================================
   GET SINGLE MARK
====================================================== */
// @route   GET /api/marks/:id
// @access  Student (own), Teacher (own), Admin
export const getMark = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid mark ID");
  }

  const mark = await Mark.findById(id)
    .populate("student", "name email")
    .populate("subject", "name code")
    .populate("recordedBy", "name email");

  if (!mark) {
    res.status(404);
    throw new Error("Mark not found");
  }

  // Access control
  if (
    req.user.role === "student" &&
    mark.student._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Access denied");
  }

  if (
    req.user.role === "teacher" &&
    mark.recordedBy._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Access denied");
  }

  res.status(200).json({
    success: true,
    data: mark,
  });
});

/* ======================================================
   UPDATE MARK
====================================================== */
// @route   PUT /api/marks/:id
// @access  Teacher (own), Admin
export const updateMark = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid mark ID");
  }

  const mark = await Mark.findById(id);

  if (!mark) {
    res.status(404);
    throw new Error("Mark not found");
  }

  // Only creator teacher or admin
  if (
    req.user.role === "teacher" &&
    mark.recordedBy.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("You can only update marks you recorded");
  }

  mark.score = score ?? mark.score;
  const updatedMark = await mark.save();

  res.status(200).json({
    success: true,
    message: "Mark updated successfully",
    data: updatedMark,
  });
});

/* ======================================================
   DELETE MARK
====================================================== */
// @route   DELETE /api/marks/:id
// @access  Admin only
export const deleteMark = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid mark ID");
  }

  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only admins can delete marks");
  }

  const mark = await Mark.findById(id);
  if (!mark) {
    res.status(404);
    throw new Error("Mark not found");
  }

  await mark.deleteOne();

  res.status(200).json({
    success: true,
    message: "Mark deleted successfully",
  });
});
