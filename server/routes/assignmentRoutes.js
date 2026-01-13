import express from "express";
import {
    getAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    reviewSubmission,
    getMySubmissions,
} from "../controllers/assignmentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Student routes
router.get("/my-submissions", authorize("student"), getMySubmissions);

// General routes
router.route("/")
    .get(getAssignments)
    .post(authorize("teacher", "admin"), createAssignment);

router.route("/:id")
    .get(getAssignment)
    .put(authorize("teacher", "admin"), updateAssignment)
    .delete(authorize("teacher", "admin"), deleteAssignment);

// Submission routes
router.post("/:id/submit", authorize("student"), submitAssignment);
router.put(
    "/:id/submissions/:submissionId/review",
    authorize("teacher", "admin"),
    reviewSubmission
);

export default router;
