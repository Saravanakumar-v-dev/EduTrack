// server/controllers/subjectController.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Subject from "../models/Subject.js";
import User from "../models/User.js";
import Mark from "../models/Mark.js";

/* ======================================================
   CREATE SUBJECT
====================================================== */
// @route   POST /api/subjects
// @access  Admin, Teacher
export const createSubject = asyncHandler(async (req, res) => {
  if (!["admin", "teacher"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Only admins or teachers can create subjects");
  }

  const { name, code, description, teacherId } = req.body;

  if (!name || !code) {
    res.status(400);
    throw new Error("Subject name and code are required");
  }

  const subjectExists = await Subject.findOne({ code });
  if (subjectExists) {
    res.status(400);
    throw new Error("Subject with this code already exists");
  }

  let teacher = null;

  // Admin can assign any teacher
  if (teacherId) {
    teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      res.status(404);
      throw new Error("Assigned teacher not found or invalid");
    }
  }

  // Teacher creating subject → auto-assign self
  if (req.user.role === "teacher") {
    teacher = req.user._id;
  }

  const subject = await Subject.create({
    name,
    code,
    description,
    teacher,
  });

  res.status(201).json({
    success: true,
    message: "Subject created successfully",
    data: subject,
  });
});

/* ======================================================
   GET ALL SUBJECTS
====================================================== */
// @route   GET /api/subjects
// @access  Admin, Teacher, Student
export const getAllSubjects = asyncHandler(async (req, res) => {
  const filter = {};

  // Teacher → only assigned subjects
  if (req.user.role === "teacher") {
    filter.teacher = req.user._id;
  }

  const subjects = await Subject.find(filter)
    .populate("teacher", "name email")
    .sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: subjects.length,
    data: subjects,
  });
});

/* ======================================================
   GET SINGLE SUBJECT
====================================================== */
// @route   GET /api/subjects/:id
// @access  Admin, Teacher, Student
export const getSubjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid subject ID");
  }

  const subject = await Subject.findById(id).populate(
    "teacher",
    "name email"
  );

  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  // Teacher can only view assigned subject
  if (
    req.user.role === "teacher" &&
    subject.teacher &&
    subject.teacher._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this subject");
  }

  res.status(200).json({
    success: true,
    data: subject,
  });
});

/* ======================================================
   UPDATE SUBJECT
====================================================== */
// @route   PUT /api/subjects/:id
// @access  Admin, Teacher (own)
export const updateSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, code, description, teacherId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid subject ID");
  }

  const subject = await Subject.findById(id);
  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  // Teacher can only update own subject
  if (
    req.user.role === "teacher" &&
    subject.teacher?.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to update this subject");
  }

  // Update basic fields
  if (name) subject.name = name;
  if (code) subject.code = code;
  if (description !== undefined) subject.description = description;

  // Admin can reassign / unassign teacher
  if (req.user.role === "admin") {
    if (teacherId) {
      const teacher = await User.findById(teacherId);
      if (!teacher || teacher.role !== "teacher") {
        res.status(404);
        throw new Error("Assigned teacher not found or invalid");
      }
      subject.teacher = teacher._id;
    }

    if (teacherId === null) {
      subject.teacher = undefined;
    }
  }

  const updatedSubject = await subject.save();

  res.status(200).json({
    success: true,
    message: "Subject updated successfully",
    data: updatedSubject,
  });
});

/* ======================================================
   DELETE SUBJECT
====================================================== */
// @route   DELETE /api/subjects/:id
// @access  Admin only
export const deleteSubject = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only admins can delete subjects");
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid subject ID");
  }

  const subject = await Subject.findById(id);
  if (!subject) {
    res.status(404);
    throw new Error("Subject not found");
  }

  // Prevent deletion if marks exist
  const marksExist = await Mark.exists({ subject: subject._id });
  if (marksExist) {
    res.status(400);
    throw new Error("Cannot delete subject with recorded marks");
  }

  await subject.deleteOne();

  res.status(200).json({
    success: true,
    message: "Subject deleted successfully",
  });
});
