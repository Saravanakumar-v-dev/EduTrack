import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';

import {
    // Standard Auth
    authUser,                 // Login
    logoutUser,               // Logout
    getUserProfile,           // Get user profile
    updateUserProfile,        // Update user profile

    // Registration with OTP
    requestRegisterOtp,       // Step 1: Send OTP to email
    verifyAndRegisterUser,    // Step 2: Verify OTP & create account

    // Password Reset with OTP
    requestPasswordResetOtp,  // Step 1: Send reset OTP
    verifyPasswordResetOtp,   // Step 2: Verify OTP
    resetPasswordWithOtp      // Step 3: Set new password after OTP verification
} from '../controllers/authController.js';

// --- Registration Flow ---
router.post('/request-register-otp', requestRegisterOtp);   // Send OTP
router.post('/verify-register', verifyAndRegisterUser);     // Verify OTP and register user

// --- Login/Logout/Profile ---
router.post('/login', authUser);                            // Login
router.post('/logout', logoutUser);                         // Logout
router.route('/profile')                                    // Profile routes (protected)
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// --- Password Reset Flow ---
router.post('/request-reset-otp', requestPasswordResetOtp); // Send OTP for password reset
router.post('/verify-reset-otp', verifyPasswordResetOtp);   // Verify OTP for password reset
router.post('/reset-password-otp', resetPasswordWithOtp);   // Reset password after OTP verification

export default router;
    