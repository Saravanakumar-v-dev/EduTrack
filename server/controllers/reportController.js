// server/controllers/reportController.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/User.js";
import Grade from "../models/Grade.js";
import Mark from "../models/Mark.js";
import Attendance from "../models/Attendance.js";
import Subject from "../models/Subject.js";

/* ======================================================
   OVERALL PERFORMANCE REPORT
====================================================== */
// @route   GET /api/reports/overall
// @access  Admin, Teacher
export const getOverallPerformanceReport = asyncHandler(async (req, res) => {
  if (!["admin", "teacher"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Access denied");
  }

  const avgScoreAgg = await Mark.aggregate([
    {
      $group: {
        _id: null,
        averageScore: { $avg: "$score" },
      },
    },
  ]);

  const topSubjectAgg = await Mark.aggregate([
    {
      $group: {
        _id: "$subject",
        avgScore: { $avg: "$score" },
      },
    },
    { $sort: { avgScore: -1 } },
    { $limit: 1 },
    {
      $lookup: {
        from: "subjects",
        localField: "_id",
        foreignField: "_id",
        as: "subject",
      },
    },
    { $unwind: "$subject" },
  ]);

  res.status(200).json({
    success: true,
    data: {
      averageScore: Number(
        avgScoreAgg[0]?.averageScore?.toFixed(2) || 0
      ),
      topSubject: topSubjectAgg[0]?.subject?.name || null,
    },
  });
});

/* ======================================================
   CLASS ATTENDANCE REPORT
====================================================== */
// @route   GET /api/reports/class-attendance
// @access  Admin, Teacher
export const getClassAttendanceReport = asyncHandler(async (req, res) => {
  const { classId } = req.query;

  if (!["admin", "teacher"].includes(req.user.role)) {
    res.status(403);
    throw new Error("Access denied");
  }

  if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
    res.status(400);
    throw new Error("Valid class ID required");
  }

  const attendanceAgg = await Attendance.aggregate([
    { $match: { grade: new mongoose.Types.ObjectId(classId) } },
    {
      $group: {
        _id: "$present",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        status: {
          $cond: ["$_id", "Present", "Absent"],
        },
        count: 1,
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    summary: attendanceAgg,
  });
});

/* ======================================================
   STUDENT GRADE HISTORY
====================================================== */
// @route   GET /api/reports/student/:id
// @access  Student (self) | Admin | Teacher
export const getStudentGradeHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid student ID");
  }

  // Students can only view their own report
  if (
    req.user.role === "student" &&
    req.user._id.toString() !== id
  ) {
    res.status(403);
    throw new Error("Access denied");
  }

  const grades = await Mark.aggregate([
    { $match: { student: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "subjects",
        localField: "subject",
        foreignField: "_id",
        as: "subject",
      },
    },
    { $unwind: "$subject" },
    {
      $project: {
        _id: 0,
        subject: "$subject.name",
        score: "$score",
        examType: "$examType",
        date: 1,
      },
    },
    { $sort: { date: -1 } },
  ]);

  res.status(200).json({
    success: true,
    count: grades.length,
    data: grades,
  });
});
