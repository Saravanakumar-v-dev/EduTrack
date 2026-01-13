// routes/studentRoutes.js
import express from "express";
import {
  getAllStudents,
  getStudentById,
  updateStudentProfile,
  deleteStudent,
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudentProfile);
router.delete("/:id", deleteStudent);

export default router;
