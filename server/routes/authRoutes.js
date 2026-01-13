import express from "express";
import {
   authUser,
   logoutUser,
   getUserProfile,
   requestRegisterOtp,
   verifyAndRegisterUser,
   registerWithFirebase,
   loginWithFirebase,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= AUTH ================= */
router.post("/login", authUser);
router.post("/logout", protect, logoutUser);

/* ================= REGISTER (Email OTP - Legacy) ================= */
router.post("/request-register-otp", requestRegisterOtp);
router.post("/verify-register", verifyAndRegisterUser);

/* ================= FIREBASE AUTH (Phone & Email) ================= */
router.post("/register-firebase", registerWithFirebase);
router.post("/login-firebase", loginWithFirebase);

/* ================= PROFILE ================= */
router.get("/profile", protect, getUserProfile);

export default router;
