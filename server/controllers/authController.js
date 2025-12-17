import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendOtpEmail } from '../services/emailService.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// --- Helper Functions ---
const generateOtp = () => crypto.randomInt(100000, 999999).toString();
const OTP_EXPIRY_MINUTES = 10;

// --- Registration with OTP ---

// @desc    Request OTP for registration
// @route   POST /api/auth/request-register-otp
// @access  Public
export const requestRegisterOtp = asyncHandler(async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) { res.status(400); throw new Error('Name and Email are required.'); }

    const userExists = await User.findOne({ email, isVerified: true });
    if (userExists) {
        res.status(400); throw new Error('Email is already registered. Please log in.');
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    try {
        await User.updateOne(
            { email },
            { $set: { name: name, verificationOtp: hashedOtp, otpExpires: otpExpires, isVerified: false } },
            { upsert: true }
        );
        console.log(`[OTP Request - Register] Generated OTP: ${otp} (Hashed). Stored for ${email}.`);
    } catch (dbError) {
         console.error("DB Error storing OTP for registration:", dbError);
         res.status(500); throw new Error('Database error during OTP setup.');
    }

    try {
        await sendOtpEmail(email, otp, 'Account Verification');
        res.status(200).json({ message: `OTP sent to ${email}. Expires in ${OTP_EXPIRY_MINUTES} minutes.` });
    } catch (emailError) {
        console.error("Error sending OTP email:", emailError);
        await User.updateOne({ email }, { $unset: { verificationOtp: "", otpExpires: "" } });
        res.status(500); throw new Error('Failed to send verification email.');
    }
});

// @desc    Verify OTP and Register User
// @route   POST /api/auth/verify-register
// @access  Public
export const verifyAndRegisterUser = asyncHandler(async (req, res) => {
    const { name, email, password, role = 'student', otp } = req.body;
    if (!name || !email || !password || !otp) { res.status(400); throw new Error('All fields required.'); }

    const userOtpRecord = await User.findOne({
        email,
        otpExpires: { $gt: Date.now() }
    }).select('+verificationOtp +otpExpires'); // SELECT HASH

    if (!userOtpRecord || !userOtpRecord.verificationOtp) {
        res.status(400); throw new Error('Invalid or expired OTP. Request a new one.');
    }

    const isOtpValid = await bcrypt.compare(otp, userOtpRecord.verificationOtp); // COMPARE HASH
    if (!isOtpValid) {
        res.status(400); throw new Error('Invalid verification code.');
    }

    // Finalize registration
    userOtpRecord.password = password;
    userOtpRecord.name = name;
    userOtpRecord.role = role;
    userOtpRecord.isVerified = true;
    userOtpRecord.verificationOtp = undefined;
    userOtpRecord.otpExpires = undefined;

    const registeredUser = await userOtpRecord.save();

    generateToken(res, registeredUser._id); // Log in
    res.status(201).json({ _id: registeredUser._id, name: registeredUser.name, email: registeredUser.email, role: registeredUser.role });
});


// --- Password Reset with OTP ---

// @desc    Request OTP for Password Reset
// @route   POST /api/auth/request-reset-otp
export const requestPasswordResetOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) { res.status(400); throw new Error('Email is required.'); }

    const user = await User.findOne({ email });
    if (!user) { return res.status(200).json({ message: `If ${email} is registered, an OTP sent.` }); }

    const otp = generateOtp();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    user.verificationOtp = hashedOtp;
    user.otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await user.save(); // Save HASH

    try {
        await sendOtpEmail(email, otp, 'Password Reset'); // Send PLAIN
        res.status(200).json({ message: `OTP sent to ${email}.` });
    } catch (emailError) {
         console.error("Error sending Reset OTP:", emailError);
         user.verificationOtp = undefined; user.otpExpires = undefined; await user.save(); // Cleanup
         res.status(500); throw new Error('Failed to send reset email.');
    }
});

// @desc    Verify OTP for Password Reset
// @route   POST /api/auth/verify-reset-otp
export const verifyPasswordResetOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) { res.status(400); throw new Error('Email and OTP required.'); }

    const user = await User.findOne({ email, otpExpires: { $gt: Date.now() } }).select('+verificationOtp'); // Select HASH
    if (!user || !user.verificationOtp) { res.status(400); throw new Error('Invalid/expired OTP request.'); }

    const isOtpValid = await bcrypt.compare(otp, user.verificationOtp); // Compare HASH
    if (!isOtpValid) { res.status(400); throw new Error('Invalid OTP.'); }

    res.status(200).json({ message: 'OTP verified.' });
});

// @desc    Reset password using a verified OTP
// @route   POST /api/auth/reset-password-otp
export const resetPasswordWithOtp = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword || newPassword.length < 8) { res.status(400); throw new Error('All fields required.'); }

    // Re-verify OTP against HASH
    const user = await User.findOne({ email }).select('+verificationOtp +otpExpires');
    if (!user || user.otpExpires < Date.now()) { res.status(400); throw new Error('Invalid/expired session.'); }
    const isOtpValid = await bcrypt.compare(otp, user.verificationOtp);
    if (!isOtpValid) { res.status(400); throw new Error('Invalid OTP provided.'); }

    // Update password & clear OTP fields
    user.password = newPassword;
    user.verificationOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
});


// --- Standard Login/Logout/Profile ---

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
// CRITICAL: Ensure this function is exported with the name 'authUser'
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (!user.isVerified) { res.status(401); throw new Error('Account not verified.'); }
        generateToken(res, user._id); // Sets HttpOnly cookie
        res.status(200).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
        res.status(401); throw new Error('Invalid email or password');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private (usually requires user to be logged in)
export const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is populated by 'protect' middleware
    res.status(200).json({ _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) { user.password = req.body.password; }
        const updatedUser = await user.save();
        res.status(200).json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role });
    } else {
        res.status(404); throw new Error('User not found');
    }
});