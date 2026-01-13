// server/controllers/analyticsController.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Grade from "../models/Grade.js";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

/* ======================================================
   UTILITIES
====================================================== */

const getStartDate = (range) => {
  const now = new Date();
  if (range === "3m") now.setMonth(now.getMonth() - 3);
  else if (range === "12m") now.setMonth(now.getMonth() - 12);
  else now.setMonth(now.getMonth() - 6);
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const monthLabel = (isoMonth) => {
  const [year, month] = isoMonth.split("-");
  const dt = new Date(Number(year), Number(month) - 1, 1);
  return dt.toLocaleString("default", { month: "short", year: "numeric" });
};

/* ======================================================
   ROLE-AWARE MATCH BUILDER
====================================================== */

const buildMatch = (req, startDate) => {
  const match = { date: { $gte: startDate } };

  // Student → only own data
  if (req.user.role === "student") {
    match.student = new mongoose.Types.ObjectId(req.user._id);
  }

  // Teacher → students they taught (optional filter by teacher)
  if (req.user.role === "teacher") {
    match.teacher = new mongoose.Types.ObjectId(req.user._id);
  }

  // Admin → no restriction (global analytics)

  return match;
};

/* ======================================================
   STUDENT DASHBOARD (SUMMARY)
====================================================== */

export const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const grades = await Grade.find({ student: studentId });
  const attendance = await Attendance.find({ student: studentId });

  const overallAverage =
    grades.reduce((sum, g) => sum + g.score, 0) / (grades.length || 1);

  const attendancePct =
    attendance.reduce((sum, a) => sum + (a.present ? 1 : 0), 0) /
    (attendance.length || 1) *
    100;

  const riskLevel =
    overallAverage < 40 || attendancePct < 70 ? "High Risk" : "Normal";

  res.json({
    overallAverage: Math.round(overallAverage),
    totalSubjects: grades.length,
    attendance: Math.round(attendancePct),
    riskLevel,
    subjects: grades.map((g) => ({
      subject: g.subject,
      marks: g.score,
    })),
    recentResults: grades.slice(-5).map((g) => ({
      exam: g.subject,
      score: g.score,
    })),
  });
});

/* ======================================================
   PERFORMANCE (MONTHLY AVG SCORE)
====================================================== */

export const getPerformance = asyncHandler(async (req, res) => {
  const range = req.query.range || "6m";
  const startDate = getStartDate(range);
  const match = buildMatch(req, startDate);

  const agg = await Grade.aggregate([
    { $match: match },
    {
      $project: {
        score: 1,
        yearMonth: { $dateToString: { format: "%Y-%m", date: "$date" } },
      },
    },
    {
      $group: {
        _id: "$yearMonth",
        averageScore: { $avg: "$score" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(
    agg.map((r) => ({
      month: r._id,
      monthLabel: monthLabel(r._id),
      averageScore: Number(r.averageScore.toFixed(2)),
    }))
  );
});

/* ======================================================
   ATTENDANCE (MONTHLY %)
====================================================== */

export const getAttendance = asyncHandler(async (req, res) => {
  const range = req.query.range || "6m";
  const startDate = getStartDate(range);
  const match = buildMatch(req, startDate);

  const agg = await Attendance.aggregate([
    { $match: match },
    {
      $project: {
        present: 1,
        yearMonth: { $dateToString: { format: "%Y-%m", date: "$date" } },
      },
    },
    {
      $group: {
        _id: "$yearMonth",
        presentCount: { $sum: { $cond: ["$present", 1, 0] } },
        totalCount: { $sum: 1 },
      },
    },
    {
      $project: {
        attendancePct: {
          $cond: [
            { $gt: ["$totalCount", 0] },
            { $multiply: [{ $divide: ["$presentCount", "$totalCount"] }, 100] },
            0,
          ],
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(
    agg.map((r) => ({
      month: r._id,
      monthLabel: monthLabel(r._id),
      attendance: Number(r.attendancePct.toFixed(2)),
    }))
  );
});

/* ======================================================
   GRADE DISTRIBUTION (A/B/C/D/F)
====================================================== */

export const getGradeDistribution = asyncHandler(async (req, res) => {
  const range = req.query.range || "6m";
  const startDate = getStartDate(range);
  const match = buildMatch(req, startDate);

  const agg = await Grade.aggregate([
    { $match: match },
    {
      $project: {
        gradeLabel: {
          $switch: {
            branches: [
              { case: { $gte: ["$score", 90] }, then: "A" },
              { case: { $gte: ["$score", 80] }, then: "B" },
              { case: { $gte: ["$score", 70] }, then: "C" },
              { case: { $gte: ["$score", 60] }, then: "D" },
            ],
            default: "F",
          },
        },
      },
    },
    {
      $group: {
        _id: "$gradeLabel",
        count: { $sum: 1 },
      },
    },
  ]);

  const labels = ["A", "B", "C", "D", "F"];
  const map = {};
  agg.forEach((g) => (map[g._id] = g.count));

  res.json(labels.map((l) => ({ grade: l, count: map[l] || 0 })));
});

/* ======================================================
   ADMIN OVERVIEW
====================================================== */

export const getAdminOverview = asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalTeachers = await User.countDocuments({ role: "teacher" });

  res.json({
    totalStudents,
    totalTeachers,
  });
});
