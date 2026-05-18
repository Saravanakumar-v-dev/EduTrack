import express from "express";
import {
   authUser,
   logoutUser,
   getUserProfile,
   loginWithFirebase,
   registerWithFirebase,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= AUTH ================= */
router.post("/login", authUser);
router.post("/logout", protect, logoutUser);

/* ================= FIREBASE AUTH ================= */
router.post("/login-firebase", loginWithFirebase);
// TEMPORARY: Public registration enabled to allow admin creation
router.post("/register-firebase", registerWithFirebase);

/* ================= PROFILE ================= */
router.get("/profile", protect, getUserProfile);

export default router;
