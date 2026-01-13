import axios from "./axios";

/*
|--------------------------------------------------------------------------
| Auth API Layer
|--------------------------------------------------------------------------
| Centralized authentication-related API calls
| Keeps components clean and scalable
|--------------------------------------------------------------------------
*/

/* ---------------- AUTH ---------------- */

/**
 * Login user
 * Supports normal login + 2FA flow
 */
export const loginUser = async (payload) => {
  const { data } = await axios.post("/api/auth/login", payload);
  return data;
};

/**
 * Logout user (optional backend session cleanup)
 */
export const logoutUser = async () => {
  const { data } = await axios.post("/api/auth/logout");
  return data;
};

/* ---------------- REGISTER + OTP ---------------- */

/**
 * Request registration OTP
 */
export const requestRegistrationOtp = async (payload) => {
  const { data } = await axios.post(
    "/api/auth/register/request-otp",
    payload
  );
  return data;
};

/**
 * Verify registration OTP & create account
 */
export const verifyRegistrationOtp = async (payload) => {
  const { data } = await axios.post(
    "/api/auth/register/verify-otp",
    payload
  );
  return data;
};

/* ---------------- FORGOT PASSWORD ---------------- */

/**
 * Request password reset OTP
 */
export const requestPasswordResetOtp = async (payload) => {
  const { data } = await axios.post(
    "/api/auth/password/request-otp",
    payload
  );
  return data;
};

/**
 * Verify password reset OTP
 */
export const verifyPasswordResetOtp = async (payload) => {
  const { data } = await axios.post(
    "/api/auth/password/verify-otp",
    payload
  );
  return data;
};

/**
 * Reset password using verified OTP
 */
export const resetPasswordWithOtp = async (payload) => {
  const { data } = await axios.post(
    "/api/auth/password/reset",
    payload
  );
  return data;
};

/* ---------------- TWO FACTOR AUTH ---------------- */

/**
 * Verify login OTP (2FA)
 */
export const verifyLoginOtp = async (payload) => {
  const { data } = await axios.post(
    "/api/auth/login/verify-otp",
    payload
  );
  return data;
};

/* ---------------- PROFILE / SETTINGS ---------------- */

/**
 * Update user profile
 */
export const updateProfile = async (payload) => {
  const { data } = await axios.put(
    "/api/users/profile",
    payload
  );
  return data;
};

/**
 * Toggle two-factor authentication
 */
export const toggleTwoFactor = async () => {
  const { data } = await axios.post(
    "/api/users/toggle-2fa"
  );
  return data;
};

/**
 * Get current logged-in user
 */
export const getCurrentUser = async () => {
  const { data } = await axios.get("/api/auth/me");
  return data;
};
