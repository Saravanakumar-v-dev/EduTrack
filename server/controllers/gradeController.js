// server/controllers/gradeController.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Grade from "../models/Grade.js";
import Mark from "../models/Mark.js";

/* ======================================================
   CREATE GRADE / CLASS
====================================================== */
// @route   POST /api/grades
// @access  Admin only
export const createGrade = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only admins can create grades/classes");
  }

  const { name, year, classTeacher, students } = req.body;

  if (!name || !year) {
    res.status(400);
    throw new Error("Grade name and year are required");
  }

  const grade = await Grade.create({
    name,
    year,
    classTeacher: classTeacher || null,
    students: students || [],
  });

  res.status(201).json({
    success: true,
    message: "Grade/Class created successfully",
    data: grade,
  });
});

/* ======================================================
   GET ALL GRADES
====================================================== */
// @route   GET /api/grades
// @access  Admin, Teacher
export const getGrades = asyncHandler(async (req, res) => {
  if (!["admin", "teacher"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Access denied");
  }

  const grades = await Grade.find()
    .populate("classTeacher", "name email")
    .populate("students", "name email")
    .sort({ year: -1, name: 1 });

  res.status(200).json({
    success: true,
    count: grades.length,
    data: grades,
  });
});

/* ======================================================
   GET SINGLE GRADE
====================================================== */
// @route   GET /api/grades/:id
// @access  Admin | Teacher (assigned) | Student (enrolled)
export const getGrade = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid Grade ID");
  }

  const grade = await Grade.findById(id)
    .populate("classTeacher", "name email")
    .populate("students", "name email");

  if (!grade) {
    res.status(404);
    throw new Error("Grade/Class not found");
  }

  // Teacher access: must be assigned
  if (
    req.user.role === "teacher" &&
    (!grade.classTeacher ||
      grade.classTeacher._id.toString() !== req.user._id.toString())
  ) {
    res.status(403);
    throw new Error("You are not assigned to this class");
  }

  // Student access: must be enrolled
  if (req.user.role === "student") {
    const isEnrolled = grade.students.some(
      (s) => s._id.toString() === req.user._id.toString()
    );
    if (!isEnrolled) {
      res.status(403);
      throw new Error("You are not enrolled in this class");
    }
  }

  res.status(200).json({
    success: true,
    data: grade,
  });
});

/* ======================================================
   UPDATE GRADE
====================================================== */
// @route   PUT /api/grades/:id
// @access  Admin only
export const updateGrade = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only admins can update grades/classes");
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid Grade ID");
  }

  const grade = await Grade.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!grade) {
    res.status(404);
    throw new Error("Grade/Class not found");
  }

  res.status(200).json({
    success: true,
    message: "Grade/Class updated successfully",
    data: grade,
  });
});

/* ======================================================
   DELETE GRADE
====================================================== */
// @route   DELETE /api/grades/:id
// @access  Admin only
export const deleteGrade = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only admins can delete grades/classes");
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid Grade ID");
  }

  const grade = await Grade.findById(id);
  if (!grade) {
    res.status(404);
    throw new Error("Grade/Class not found");
  }

  await grade.deleteOne();

  res.status(200).json({
    success: true,
    message: "Grade/Class deleted successfully",
  });
});

/* ======================================================
   GRADE PERFORMANCE REPORT
====================================================== */
// @route   GET /api/grades/:id/report
// @access  Admin | Teacher (assigned)
export const getGradeReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid Grade ID");
  }

  const grade = await Grade.findById(id).select(
    "name students classTeacher"
  );

  if (!grade) {
    res.status(404);
    throw new Error("Grade/Class not found");
  }

  // Teacher access check
  if (
    req.user.role === "teacher" &&
    grade.classTeacher?.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("You are not assigned to this class");
  }

  if (!grade.students || grade.students.length === 0) {
    return res.status(200).json({
      success: true,
      gradeName: grade.name,
      report: [],
      message: "No students enrolled in this class",
    });
  }

  const report = await Mark.aggregate([
    { $match: { student: { $in: grade.students } } },
    {
      $group: {
        _id: "$student",
        averageScore: { $avg: "$score" },
      },
    },
    { $sort: { averageScore: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },
    {
      $project: {
        _id: 0,
        studentId: "$student._id",
        name: "$student.name",
        avg: { $round: ["$averageScore", 2] },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    gradeName: grade.name,
    report,
  });
});
