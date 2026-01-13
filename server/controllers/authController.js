import asyncHandler from "express-async-handler";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendOtpEmail } from "../services/emailService.js";
import {
  generateTokenAndSetCookie,
  clearTokenCookie,
} from "../utils/generateToken.js";
import { verifyFirebaseToken } from "../config/firebaseAdmin.js";

const OTP_EXPIRY_MINUTES = 10;

const generateOtp = () =>
  crypto.randomInt(100000, 999999).toString();

/* ================= REGISTER – STEP 1 ================= */
export const requestRegisterOtp = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  const existingVerified = await User.findOne({
    email,
    isVerified: true,
  });

  if (existingVerified) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await User.updateOne(
    { email },
    {
      $set: {
        name,
        verificationOtp: hashedOtp,
        otpExpires: Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
        isVerified: false,
      },
    },
    { upsert: true }
  );

  await sendOtpEmail(email, otp, "Account Verification");

  res.status(200).json({ message: "OTP sent to email" });
});

/* ================= REGISTER – STEP 2 ================= */
export const verifyAndRegisterUser = asyncHandler(async (req, res) => {
  const { name, email, password, otp, role = "student" } = req.body;

  if (!name || !email || !password || !otp) {
    res.status(400);
    throw new Error("All fields required");
  }

  const user = await User.findOne({
    email,
    otpExpires: { $gt: Date.now() },
  }).select("+verificationOtp");

  if (!user) {
    res.status(400);
    throw new Error("OTP expired or invalid");
  }

  const otpValid = await bcrypt.compare(otp, user.verificationOtp);
  if (!otpValid) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  user.name = name;
  user.password = password;        // hash ONCE here
  user.role = role;
  user.isVerified = true;
  user.verificationOtp = undefined;
  user.otpExpires = undefined;

  await user.save();

  generateTokenAndSetCookie(res, user._id, user.role);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

/* ================= LOGIN (Phone or Email) ================= */
export const authUser = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  // Find user by email OR phone
  const query = phone ? { phone } : { email };
  const user = await User.findOne(query).select("+password");

  if (!user || !user.isVerified) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const match = await user.matchPassword(password);
  if (!match) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  generateTokenAndSetCookie(res, user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  });
});

/* ================= REGISTER WITH FIREBASE (Phone or Email) ================= */
export const registerWithFirebase = asyncHandler(async (req, res) => {
  const { name, phone, email, password, firebaseUid, idToken, role = "student" } = req.body;

  // Require either phone OR email
  if (!name || (!phone && !email) || !password || !firebaseUid) {
    res.status(400);
    throw new Error("Name, phone/email, password, and Firebase UID are required");
  }

  // Verify Firebase token (optional but recommended)
  try {
    if (idToken) {
      await verifyFirebaseToken(idToken);
    }
  } catch (error) {
    console.log("⚠️ Firebase token verification skipped:", error.message);
  }

  // Check if already registered
  const searchQuery = phone ? { phone, isVerified: true } : { email, isVerified: true };
  const existingUser = await User.findOne(searchQuery);
  if (existingUser) {
    res.status(400);
    throw new Error(phone ? "Phone number already registered" : "Email already registered");
  }

  // Check if firebaseUid already used
  const existingFirebaseUser = await User.findOne({ firebaseUid });
  if (existingFirebaseUser) {
    res.status(400);
    throw new Error("This account is already registered");
  }

  // Create or update user (supports both phone and email)
  const query = phone ? { phone } : { email };
  let user = await User.findOne(query);

  if (user) {
    // Update existing unverified user
    user.name = name;
    user.password = password;
    user.firebaseUid = firebaseUid;
    user.role = role;
    user.isVerified = true;
    if (email) user.email = email;
    if (phone) user.phone = phone;
  } else {
    // Create new user
    user = new User({
      name,
      email,
      phone,
      password,
      firebaseUid,
      role,
      isVerified: true,
    });
  }

  await user.save();

  generateTokenAndSetCookie(res, user._id);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  });
});

/* ================= LOGIN WITH FIREBASE (Email) ================= */
export const loginWithFirebase = asyncHandler(async (req, res) => {
  const { email, firebaseUid, idToken } = req.body;

  if (!email || !firebaseUid) {
    res.status(400);
    throw new Error("Email and Firebase UID are required");
  }

  // Verify Firebase token (optional but recommended)
  try {
    if (idToken) {
      await verifyFirebaseToken(idToken);
    }
  } catch (error) {
    console.log("⚠️ Firebase token verification skipped:", error.message);
  }

  // Find user by email or firebaseUid
  let user = await User.findOne({
    $or: [{ email }, { firebaseUid }]
  });

  if (!user) {
    res.status(401);
    throw new Error("Account not found. Please register first.");
  }

  if (!user.isVerified) {
    res.status(401);
    throw new Error("Account not verified");
  }

  generateTokenAndSetCookie(res, user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  });
});

/* ================= LOGOUT ================= */
export const logoutUser = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  res.status(200).json({ message: "Logged out" });
});

/* ================= PROFILE ================= */
export const getUserProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});
