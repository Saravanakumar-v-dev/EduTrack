// routes/gradeRoutes.js
import express from "express";
import {
  createGrade,
  getGrades,
  getGrade,
  updateGrade,
  deleteGrade,
  getGradeReport,
} from "../controllers/gradeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createGrade);
router.get("/", getGrades);
router.get("/:id", getGrade);
router.put("/:id", updateGrade);
router.delete("/:id", deleteGrade);
router.get("/:id/report", getGradeReport);

export default router;
