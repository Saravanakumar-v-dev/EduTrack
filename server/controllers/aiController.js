// server/controllers/aiController.js
import asyncHandler from "express-async-handler";
import Grade from "../models/Grade.js";
import Student from "../models/Student.js";

/**
 * @desc    Generate AI-based insights (mock for now)
 * @route   GET /api/ai/insights
 * @access  Teacher/Admin
 */
export const generateInsights = asyncHandler(async (req, res) => {
  const insights = [
    "Mathematics shows a downward trend in Class 10B.",
    "Science students scored higher when assignments were submitted early.",
    "Overall consistency improved by 5% compared to last term.",
  ];

  res.json({ insights });
});

/**
 * @desc    Predict at-risk students (mock AI logic)
 * @route   GET /api/ai/predict
 * @access  Teacher/Admin
 */
export const predictAtRiskStudents = asyncHandler(async (req, res) => {
  const grades = await Grade.find().populate("studentId", "name email");
  const lowPerformers = grades.filter((g) => (g.marks / g.maxMarks) * 100 < 40);

  const riskList = lowPerformers.map((g) => ({
    name: g.studentId.name,
    subject: g.subject,
    percentage: ((g.marks / g.maxMarks) * 100).toFixed(2),
  }));

  res.json({ atRiskStudents: riskList });
});
