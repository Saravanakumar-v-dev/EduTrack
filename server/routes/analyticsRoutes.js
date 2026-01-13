// server/routes/analyticsRoutes.js
import express from "express";
import { getPerformance, getAttendance, getGradeDistribution } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js"; // your JWT auth middleware
import { authorizeRoles } from "../middleware/roleMiddleware.js"; // optional role guard

const router = express.Router();

// All routes protected (only teachers/admins should fetch school-level analytics)
// If you want students to view their own analytics, create different endpoints or relax rules.
// analyticsRoutes.js
router.get("/student-dashboard", protect, authorize("student"), getStudentDashboard);

router.get("/performance", protect, getPerformance);
router.get("/attendance", protect, getAttendance);
router.get("/grades", protect, getGradeDistribution);

router.get("/admin-overview", protect, authorize("admin"), getAdminOverview);


export default router;
