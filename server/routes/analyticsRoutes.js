// server/routes/analyticsRoutes.js
import express from "express";
import { getPerformance, getAttendance, getGradeDistribution } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js"; // your JWT auth middleware
import { authorizeRoles } from "../middleware/roleMiddleware.js"; // optional role guard

const router = express.Router();

// All routes protected (only teachers/admins should fetch school-level analytics)
// If you want students to view their own analytics, create different endpoints or relax rules.
router.get("/performance", protect, authorizeRoles("admin", "teacher"), getPerformance);
router.get("/attendance", protect, authorizeRoles("admin", "teacher"), getAttendance);
router.get("/grades", protect, authorizeRoles("admin", "teacher"), getGradeDistribution);

export default router;
