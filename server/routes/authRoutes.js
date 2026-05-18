import express from "express";
import {
   authUser,
   logoutUser,
   getUserProfile,
   loginWithFirebase,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= AUTH ================= */
router.post("/login", authUser);
router.post("/logout", protect, logoutUser);

/* ================= FIREBASE AUTH (Login Only) ================= */
// Registration is now admin-only via /api/admin/users
router.post("/login-firebase", loginWithFirebase);

/* ================= PROFILE ================= */
router.get("/profile", protect, getUserProfile);

export default router;
