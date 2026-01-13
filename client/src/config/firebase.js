import { initializeApp } from "firebase/app";
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
} from "firebase/auth";

/* ======================================================
   FIREBASE CONFIGURATION
   Your Firebase project credentials
====================================================== */
const firebaseConfig = {
    apiKey: "AIzaSyBWTQpO9iTcSYvVDCd5nwL-_xnjLKnb3to",
    authDomain: "edutrack-48d08.firebaseapp.com",
    projectId: "edutrack-48d08",
    storageBucket: "edutrack-48d08.firebasestorage.app",
    messagingSenderId: "935962082158",
    appId: "1:935962082158:web:0e73ea724580e2193f9f7f",
    measurementId: "G-N2XR4JZS2B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/* ======================================================
   RECAPTCHA SETUP (Invisible) - For Phone Auth
====================================================== */
export const setupRecaptcha = (elementId) => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
            size: "invisible",
            callback: () => {
                console.log("✅ reCAPTCHA verified");
            },
            "expired-callback": () => {
                console.log("⚠️ reCAPTCHA expired");
                window.recaptchaVerifier = null;
            }
        });
    }
    return window.recaptchaVerifier;
};

/* ======================================================
   PHONE AUTHENTICATION
====================================================== */

// Send OTP via SMS
export const sendPhoneOTP = async (phoneNumber) => {
    try {
        const appVerifier = window.recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        window.confirmationResult = confirmationResult;
        return { success: true, confirmationResult };
    } catch (error) {
        console.error("❌ Phone OTP send error:", error);
        throw error;
    }
};

// Verify Phone OTP
export const verifyPhoneOTP = async (otp) => {
    try {
        if (!window.confirmationResult) {
            throw new Error("No confirmation result. Request OTP first.");
        }
        const result = await window.confirmationResult.confirm(otp);
        return result.user;
    } catch (error) {
        console.error("❌ Phone OTP verification error:", error);
        throw error;
    }
};

/* ======================================================
   EMAIL AUTHENTICATION
====================================================== */

// Register with Email & Password
export const registerWithEmail = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Send verification email
        await sendEmailVerification(userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("❌ Email registration error:", error);
        throw error;
    }
};

// Sign in with Email & Password
export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("❌ Email sign-in error:", error);
        throw error;
    }
};

// Send Password Reset Email
export const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        console.error("❌ Password reset error:", error);
        throw error;
    }
};

/* ======================================================
   COMMON UTILITIES
====================================================== */

// Get Firebase ID Token
export const getFirebaseIdToken = async () => {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
};

// Check if email is verified
export const isEmailVerified = () => {
    const user = auth.currentUser;
    return user ? user.emailVerified : false;
};

// Resend verification email
export const resendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        return { success: true };
    }
    throw new Error("No user or already verified");
};

// Sign out from Firebase
export const signOutFirebase = async () => {
    try {
        await auth.signOut();
        window.confirmationResult = null;
        window.recaptchaVerifier = null;
    } catch (error) {
        console.error("❌ Sign out error:", error);
    }
};

// Get current user
export const getCurrentUser = () => auth.currentUser;

export default app;
