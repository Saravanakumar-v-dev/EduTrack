// server/controllers/userController.js
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

/* ======================================================
   CREATE USER (ADMIN)
====================================================== */
// @route   POST /api/users
// @access  Admin only
export const createUser = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }

  const { name, email, phone, role, password } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  // Create user with default password if not provided
  const defaultPassword = password || "EduTrack@123";

  const user = await User.create({
    name,
    email,
    phone,
    role: role || "student",
    password: defaultPassword,
    isVerified: true, // Admin-created users are auto-verified
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  });
});

/* ======================================================
   GET ALL USERS (ADMIN)
====================================================== */
// @route   GET /api/users
// @access  Admin only
export const getAllUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const match = {};

  if (req.query.role) match.role = req.query.role;
  if (req.query.search) {
    match.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const total = await User.countDocuments(match);

  const users = await User.find(match)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: users.length,
    pagination: {
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    },
    data: users,
  });
});

/* ======================================================
   GET USER BY ID (ADMIN)
====================================================== */
// @route   GET /api/users/:id
// @access  Admin only
export const getUserById = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/* ======================================================
   UPDATE USER (ADMIN)
====================================================== */
// @route   PUT /api/users/:id
// @access  Admin only
export const updateUser = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }

  const { id } = req.params;
  const { name, email, role, isActive, assignedTeacher } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent demoting last admin
  if (user.role === "admin" && role && role !== "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      res.status(400);
      throw new Error("Cannot remove the last admin");
    }
  }

  if (name) user.name = name;
  if (email) user.email = email;

  if (role) {
    if (!["admin", "teacher", "student"].includes(role)) {
      res.status(400);
      throw new Error("Invalid role value");
    }
    user.role = role;
  }

  if (typeof isActive === "boolean") {
    user.isActive = isActive;
  }

  if (assignedTeacher !== undefined) {
    if (assignedTeacher === "" || assignedTeacher === null) {
      user.assignedTeacher = undefined; // Unassign
    } else {
      if (!mongoose.Types.ObjectId.isValid(assignedTeacher)) {
        res.status(400);
        throw new Error("Invalid teacher ID");
      }
      user.assignedTeacher = assignedTeacher;
    }
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
    },
  });
});

/* ======================================================
   DELETE USER (ADMIN)
====================================================== */
// @route   DELETE /api/users/:id
// @access  Admin only
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      res.status(400);
      throw new Error("Cannot delete the last admin");
    }
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
