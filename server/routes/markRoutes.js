// routes/markRoutes.js
import express from "express";
import {
  createMark,
  bulkCreateMarks,
  getMarks,
  getMark,
  updateMark,
  deleteMark,
} from "../controllers/markController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/bulk", bulkCreateMarks);
router.post("/", createMark);
router.get("/", getMarks);
router.get("/:id", getMark);
router.put("/:id", updateMark);
router.delete("/:id", deleteMark);

export default router;
