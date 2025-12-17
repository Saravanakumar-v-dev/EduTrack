// server/controllers/analyticsController.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Grade from "../models/Grade.js";         // expects: { student: ObjectId, subject, score, date }
import Attendance from "../models/Attendance.js"; // expects: { student: ObjectId, date, present: Boolean }
import User from "../models/User.js";           // student user model

// utility: compute startDate from range param
const getStartDate = (range) => {
  const now = new Date();
  if (range === "3m") {
    now.setMonth(now.getMonth() - 3);
  } else if (range === "12m") {
    now.setMonth(now.getMonth() - 12);
  } else {
    // default 6 months
    now.setMonth(now.getMonth() - 6);
  }
  // set to first day of month for stable grouping
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const monthLabel = (isoMonth) => {
  // isoMonth e.g. "2025-01"
  const [year, month] = isoMonth.split("-");
  const dt = new Date(Number(year), Number(month) - 1, 1);
  return dt.toLocaleString("default", { month: "short", year: "numeric" }); // "Jan 2025"
};

/**
 * GET /analytics/performance
 * returns monthly avg score: [{ month: "2025-01", monthLabel: "Jan 2025", averageScore: 82 }, ...]
 */
export const getPerformance = asyncHandler(async (req, res) => {
  const range = req.query.range || "6m";
  const startDate = getStartDate(range);

  // aggregate grades grouped by year-month
  const agg = await Grade.aggregate([
    { $match: { date: { $gte: startDate } } },
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

  const result = agg.map((r) => ({
    month: r._id,
    monthLabel: monthLabel(r._id),
    averageScore: Number(r.averageScore.toFixed(2)),
  }));

  res.json(result);
});

/**
 * GET /analytics/attendance
 * returns monthly attendance percentage: [{ month: "2025-01", monthLabel:"Jan 2025", attendancePct: 92 }, ...]
 *
 * Attendance collection assumption: for each date there are attendance docs with present: true/false
 */
export const getAttendance = asyncHandler(async (req, res) => {
  const range = req.query.range || "6m";
  const startDate = getStartDate(range);

  const agg = await Attendance.aggregate([
    { $match: { date: { $gte: startDate } } },
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
        attendancePct: { $cond: [{ $gt: ["$totalCount", 0] }, { $multiply: [{ $divide: ["$presentCount", "$totalCount"] }, 100] }, 0] },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const result = agg.map((r) => ({
    month: r._id,
    monthLabel: monthLabel(r._id),
    attendance: Number((r.attendancePct ?? 0).toFixed(2)),
  }));

  res.json(result);
});

/**
 * GET /analytics/grades
 * returns grade distribution counts: [{ grade: "A", count: 120 }, ... ]
 *
 * grade buckets: A: >=90, B:80-89, C:70-79, D:60-69, F:<60
 */
export const getGradeDistribution = asyncHandler(async (req, res) => {
  // optional range filter to limit grades considered
  const range = req.query.range || "6m";
  const startDate = getStartDate(range);

  // Aggregation to bucket scores into letters
  const agg = await Grade.aggregate([
    { $match: { date: { $gte: startDate } } },
    {
      $bucket: {
        groupBy: "$score",
        boundaries: [0, 60, 70, 80, 90, 101], // buckets: 0-59,60-69,70-79,80-89,90-100
        default: "Other",
        output: {
          count: { $sum: 1 },
        },
      },
    },
  ]);

  // Map bucket boundaries to labels (aggregation returns documents with _id = bucket lower boundary or 'Other')
  // Because $bucket returns buckets keyed by boundary lower-bound as numbers, we need robust mapping:
  // We'll instead compute via $project + $group using $switch so mapping is easier:

  const agg2 = await Grade.aggregate([
    { $match: { date: { $gte: startDate } } },
    {
      $project: {
        score: 1,
        gradeLabel: {
          $switch: {
            branches: [
              { case: { $gte: ["$score", 90] }, then: "A" },
              { case: { $and: [{ $gte: ["$score", 80] }, { $lt: ["$score", 90] }] }, then: "B" },
              { case: { $and: [{ $gte: ["$score", 70] }, { $lt: ["$score", 80] }] }, then: "C" },
              { case: { $and: [{ $gte: ["$score", 60] }, { $lt: ["$score", 70] }] }, then: "D" },
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
    { $sort: { _id: 1 } },
  ]);

  // Normalize output to ensure all grade labels exist
  const labels = ["A", "B", "C", "D", "F"];
  const countsMap = {};
  agg2.forEach((r) => {
    countsMap[r._id] = r.count;
  });

  const result = labels.map((label) => ({ grade: label, count: countsMap[label] || 0 }));

  res.json(result);
});
