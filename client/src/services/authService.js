import api from "../api/axios";

/* ======================================================
   FIREBASE AUTH (Email)
====================================================== */

// Register with Firebase Email
const registerWithFirebase = (data) =>
  api.post("/auth/register-firebase", data).then(res => res.data);

// Login with Firebase (after Firebase client auth)
const loginWithFirebase = (data) =>
  api.post("/auth/login-firebase", data).then(res => res.data);

/* ======================================================
   PROFILE
====================================================== */

// Get current user profile
const getProfile = () =>
  api.get("/auth/profile").then(res => res.data);

/* ======================================================
   LOGOUT
====================================================== */

const logoutUser = () =>
  api.post("/auth/logout");

/* ======================================================
   PASSWORD RESET (Forgot Password)
====================================================== */

// Step 1: Request OTP for password reset
const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email }).then(res => res.data);

// Step 2: Verify OTP code
const verifyResetOTP = (email, otp) =>
  api.post("/auth/verify-reset-otp", { email, otp }).then(res => res.data);

// Step 3: Reset password with OTP
const resetPasswordWithOtp = ({ email, otp, newPassword }) =>
  api.post("/auth/reset-password", { email, otp, newPassword }).then(res => res.data);

export default {
  registerWithFirebase,
  loginWithFirebase,
  getProfile,
  logoutUser,
  forgotPassword,
  verifyResetOTP,
  resetPasswordWithOtp,
};
