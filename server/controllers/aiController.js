// server/controllers/aiController.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/User.js";
import Grade from "../models/Grade.js";
import Mark from "../models/Mark.js";
import Attendance from "../models/Attendance.js";

/* ======================================================
   HELPER: ROLE CHECK
====================================================== */
const ensureStaffAccess = (req) => {
  if (!["admin", "teacher"].includes(req.user.role)) {
    throw new Error("Access denied");
  }
};

/* ======================================================
   AI INSIGHTS (RULE-BASED, DATA-DRIVEN)
====================================================== */
/**
 * @desc    Generate AI-based academic insights
 * @route   GET /api/ai/insights
 * @access  Admin | Teacher
 */
export const generateInsights = asyncHandler(async (req, res) => {
  ensureStaffAccess(req);

  const insights = [];

  /* ---------- 1. SUBJECT PERFORMANCE TRENDS ---------- */
  const subjectTrends = await Mark.aggregate([
    {
      $group: {
        _id: "$subject",
        avgScore: { $avg: "$score" },
        count: { $sum: 1 },
      },
    },
    { $sort: { avgScore: 1 } },
    { $limit: 3 },
  ]);

  subjectTrends.forEach((s) => {
    insights.push(
      `Students are struggling in subject ${s._id} with an average score of ${s.avgScore.toFixed(
        1
      )}%`
    );
  });

  /* ---------- 2. ATTENDANCE VS PERFORMANCE ---------- */
  const attendanceImpact = await Attendance.aggregate([
    {
      $group: {
        _id: "$student",
        attendanceRate: {
          $avg: { $cond: ["$present", 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: "marks",
        localField: "_id",
        foreignField: "student",
        as: "marks",
      },
    },
    {
      $project: {
        attendancePct: { $multiply: ["$attendanceRate", 100] },
        avgScore: { $avg: "$marks.score" },
      },
    },
    {
      $match: {
        attendancePct: { $lt: 75 },
        avgScore: { $lt: 50 },
      },
    },
  ]);

  if (attendanceImpact.length > 0) {
    insights.push(
      "Students with attendance below 75% show significantly lower academic performance."
    );
  }

  /* ---------- 3. CLASS-LEVEL RISK ---------- */
  const gradeRisk = await Grade.aggregate([
    {
      $lookup: {
        from: "marks",
        localField: "students",
        foreignField: "student",
        as: "marks",
      },
    },
    {
      $project: {
        name: 1,
        avgScore: { $avg: "$marks.score" },
      },
    },
    { $match: { avgScore: { $lt: 55 } } },
  ]);

  gradeRisk.forEach((g) => {
    insights.push(
      `Class ${g.name} shows a low overall average (${g.avgScore.toFixed(
        1
      )}%), intervention recommended.`
    );
  });

  if (insights.length === 0) {
    insights.push("No critical academic risks detected at this time.");
  }

  res.status(200).json({ insights });
});

/* ======================================================
   PREDICT AT-RISK STUDENTS
====================================================== */
/**
 * @desc    Predict at-risk students
 * @route   GET /api/ai/predict
 * @access  Admin | Teacher
 */
export const predictAtRiskStudents = asyncHandler(async (req, res) => {
  ensureStaffAccess(req);

  const atRiskStudents = await User.aggregate([
    { $match: { role: "student" } },
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
        from: "attendance",
        localField: "_id",
        foreignField: "student",
        as: "attendance",
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        avgScore: { $avg: "$marks.score" },
        attendanceRate: {
          $avg: { $cond: ["$attendance.present", 1, 0] },
        },
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        avgScore: { $round: ["$avgScore", 2] },
        attendancePct: {
          $round: [{ $multiply: ["$attendanceRate", 100] }, 2],
        },
      },
    },
    {
      $match: {
        $or: [{ avgScore: { $lt: 45 } }, { attendancePct: { $lt: 70 } }],
      },
    },
    { $sort: { avgScore: 1 } },
  ]);

  res.status(200).json({
    count: atRiskStudents.length,
    atRiskStudents,
  });
});
