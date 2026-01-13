import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      res.status(401);
      throw new Error("Invalid token");
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    // ✅ Attach full user from DB (role included)
    req.user = user;

    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized");
  }

});

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access only");
  }
  next();
};

// Role-based authorization middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Access denied. Required roles: ${roles.join(", ")}`);
    }

    next();
  };
};
