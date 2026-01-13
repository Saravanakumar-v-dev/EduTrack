import express from "express";
import { markAttendance, getAttendance } from "../controllers/attendanceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", authorize("teacher", "admin"), markAttendance);
router.get("/", authorize("teacher", "admin", "student"), getAttendance);

export default router;
