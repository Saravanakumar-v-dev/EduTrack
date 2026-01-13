// server/controllers/studentController.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/User.js";
import Mark from "../models/Mark.js";
import Grade from "../models/Grade.js";
import cacheService from "../services/cacheService.js";

/* ======================================================
   CACHE INVALIDATION (SAFE)
====================================================== */
const safeInvalidateCache = (key) => {
  try {
    if (!key) return;
    if (cacheService?.del) cacheService.del(key);
    else if (cacheService?.invalidate) cacheService.invalidate(key);
    else if (cacheService?.remove) cacheService.remove(key);
    else cacheService?.set?.(key, null, 1);
  } catch (err) {
    console.warn("Cache invalidation failed:", key);
  }
};

/* ======================================================
   GET ALL STUDENTS
====================================================== */
// @route   GET /api/students
// @access  Admin, Teacher
export const getAllStudents = asyncHandler(async (req, res) => {
  if (!["admin", "teacher"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Access denied");
  }

  const cacheKey = `students:${JSON.stringify(req.query)}`;
  const cached = cacheService?.get?.(cacheKey);
  if (cached) return res.json(cached);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const match = { role: "student" };

  if (req.query.name) {
    match.name = { $regex: req.query.name, $options: "i" };
  }
  if (req.query.email) {
    match.email = { $regex: req.query.email, $options: "i" };
  }
  if (req.query.assignedTeacher) {
    match.assignedTeacher = new mongoose.Types.ObjectId(req.query.assignedTeacher);
  }

  const total = await User.countDocuments(match);

  const students = await User.aggregate([
    { $match: match },
    { $project: { password: 0 } },
    {
      $lookup: {
        from: "marks",
        localField: "_id",
        foreignField: "student",
        as: "marks",
      },
    },
    {
      $lookup: {
        from: "grades",
        localField: "_id",
        foreignField: "students",
        as: "classes",
      },
    },
    {
      $addFields: {
        averageGrade: { $avg: "$marks.score" },
        marksCount: { $size: "$marks" },
        classesCount: { $size: "$classes" },
      },
    },
    { $sort: { name: 1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const response = {
    students,
    pagination: {
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    },
  };

  cacheService?.set?.(cacheKey, response, 300);
  res.json(response);
});

/* ======================================================
   GET SINGLE STUDENT
====================================================== */
// @route   GET /api/students/:id
// @access  Self | Admin | Teacher
export const getStudentById = asyncHandler(async (req, res) => {
  const studentId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    res.status(400);
    throw new Error("Invalid student ID");
  }

  if (
    req.user.role === "student" &&
    req.user._id.toString() !== studentId
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const cacheKey = `student:${studentId}`;
  const cached = cacheService?.get?.(cacheKey);
  if (cached) return res.json(cached);

  const student = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(studentId),
        role: "student",
      },
    },
    { $project: { password: 0 } },
    {
      $lookup: {
        from: "marks",
        localField: "_id",
        foreignField: "student",
        as: "marks",
      },
    },
    {
      $lookup: {
        from: "grades",
        localField: "_id",
        foreignField: "students",
        as: "classes",
      },
    },
    {
      $addFields: {
        averageGrade: { $avg: "$marks.score" },
        marksCount: { $size: "$marks" },
        classesCount: { $size: "$classes" },
      },
    },
  ]);

  if (!student[0]) {
    res.status(404);
    throw new Error("Student not found");
  }

  cacheService?.set?.(cacheKey, student[0], 300);
  res.json(student[0]);
});

/* ======================================================
   UPDATE STUDENT PROFILE
====================================================== */
// @route   PUT /api/students/:id
// @access  Self | Admin | Teacher
export const updateStudentProfile = asyncHandler(async (req, res) => {
  const studentId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    res.status(400);
    throw new Error("Invalid student ID");
  }

  const student = await User.findById(studentId);
  if (!student || student.role !== "student") {
    res.status(404);
    throw new Error("Student not found");
  }

  if (
    req.user.role === "student" &&
    req.user._id.toString() !== studentId
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const allowedFields = [
    "name",
    "department",
    "year",
    "rollNumber",
    "weakestSubject",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      student[field] = req.body[field];
    }
  });

  student.lastModified = {
    by: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
    },
    at: new Date(),
  };

  await student.save();

  safeInvalidateCache(`student:${studentId}`);
  safeInvalidateCache("students:*");

  res.json({
    message: "Student profile updated",
  });
});

/* ======================================================
   DELETE STUDENT
====================================================== */
// @route   DELETE /api/students/:id
// @access  Admin only
export const deleteStudent = asyncHandler(async (req, res) => {
  const studentId = req.params.id;

  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin only");
  }

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    res.status(400);
    throw new Error("Invalid student ID");
  }

  const student = await User.findById(studentId);
  if (!student || student.role !== "student") {
    res.status(404);
    throw new Error("Student not found");
  }

  await student.deleteOne();

  safeInvalidateCache(`student:${studentId}`);
  safeInvalidateCache("students:*");

  res.json({ message: "Student deleted successfully" });
});
