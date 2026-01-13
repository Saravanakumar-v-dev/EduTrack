// server/routes/aiRoutes.js
import express from "express";
import {
  generateInsights,
  predictAtRiskStudents,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.get("/insights", generateInsights);
router.get("/predict", predictAtRiskStudents);

export default router;
