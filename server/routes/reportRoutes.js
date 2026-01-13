// routes/reportRoutes.js
import express from "express";
import {
  getOverallPerformanceReport,
  getClassAttendanceReport,
  getStudentGradeHistory,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.get("/overall", getOverallPerformanceReport);
router.get("/class-attendance", getClassAttendanceReport);
router.get("/student/:id", getStudentGradeHistory);

export default router;
