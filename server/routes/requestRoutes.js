import express from "express";
import { createRequest, getRequests, updateRequestStatus } from "../controllers/requestController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", authorize("teacher"), createRequest);
router.get("/", authorize("admin", "teacher"), getRequests);
router.put("/:id", authorize("admin"), updateRequestStatus);

export default router;
