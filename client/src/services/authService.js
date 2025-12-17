import api from '../api/api.js'; // Your configured Axios instance

// Define API endpoint paths
const REGISTER_URL = '/auth/register'; // Keep if direct register is possible
const LOGIN_URL = '/auth/login';
const LOGOUT_URL = '/auth/logout';
const PROFILE_URL = '/auth/profile';

// --- NEW OTP Endpoints ---
const REQUEST_REGISTER_OTP_URL = '/auth/request-register-otp';
const VERIFY_REGISTER_OTP_URL = '/auth/verify-register';
const REQUEST_RESET_OTP_URL = '/auth/request-reset-otp'; // For password reset
const VERIFY_RESET_OTP_URL = '/auth/verify-reset-otp';   // For password reset
const RESET_PASSWORD_OTP_URL = '/auth/reset-password-otp'; // For password reset

// --- Existing Functions ---
const loginUser = async (credentials) => {
    const response = await api.post(LOGIN_URL, credentials);
    return response.data;
};

const logoutUser = async () => {
    const response = await api.post(LOGOUT_URL);
    return response.data;
};

const getUserProfile = async () => {
    const response = await api.get(PROFILE_URL);
    return response.data;
};

// --- NEW OTP Registration Functions ---
/**
 * Requests an OTP code to be sent for registration.
 * @param {object} userData - { name, email, role }
 */
const requestRegistrationOtp = async (userData) => {
    const response = await api.post(REQUEST_REGISTER_OTP_URL, userData);
    return response.data; // Should contain a success message
};

/**
 * Verifies the OTP and completes the registration.
 * @param {object} verificationData - { name, email, password, role, otp }
 */
const verifyRegistrationOtp = async (verificationData) => {
    const response = await api.post(VERIFY_REGISTER_OTP_URL, verificationData);
    // On success, backend returns user data and sets the JWT cookie
    return response.data;
};

// --- NEW Password Reset OTP Functions ---
/**
 * Requests an OTP code for password reset.
 * @param {object} emailData - { email }
 */
const requestPasswordResetOtp = async (emailData) => {
    const response = await api.post(REQUEST_RESET_OTP_URL, emailData);
    return response.data; // Success message
};

/**
 * Verifies the OTP code received for password reset.
 * @param {object} verificationData - { email, otp }
 */
const verifyPasswordResetOtp = async (verificationData) => {
    const response = await api.post(VERIFY_RESET_OTP_URL, verificationData);
    return response.data; // Success message indicating verification
};

/**
 * Resets the password using the verified OTP.
 * @param {object} resetData - { email, otp, newPassword }
 */
const resetPasswordWithOtp = async (resetData) => {
    const response = await api.post(RESET_PASSWORD_OTP_URL, resetData);
    return response.data; // Success message
};


// --- Export all functions ---
const authService = {
    loginUser,
    logoutUser,
    getUserProfile,
    // Add OTP functions
    requestRegistrationOtp,
    verifyRegistrationOtp,
    // Add password reset functions
    requestPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPasswordWithOtp,
};

export default authService;