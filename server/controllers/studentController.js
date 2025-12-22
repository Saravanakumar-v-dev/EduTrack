// server/controllers/studentController.js
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import mongoose from "mongoose";
import cacheService from "../services/cacheService.js";

/**
 * Helper: try to remove cache keys if service supports it.
 */
const safeInvalidateCache = (key) => {
  try {
    if (!key) return;
    if (typeof cacheService.del === "function") {
      cacheService.del(key);
    } else if (typeof cacheService.invalidate === "function") {
      cacheService.invalidate(key);
    } else if (typeof cacheService.remove === "function") {
      cacheService.remove(key);
    } else {
      // fallback: overwrite with null (short TTL)
      cacheService.set(key, null, 1);
    }
  } catch (err) {
    // swallow cache errors (do not break API)
    console.warn("Cache invalidation failed for key", key, err);
  }
}

/**
 * @desc    Get all student profiles with related data
 * @route   GET /api/students
 * @access  Private/Admin, Teacher
 */
export const getAllStudents = asyncHandler(async (req, res) => {
  // Generate cache key from request parameters
  const cacheKey = cacheService.generateKey
    ? cacheService.generateKey({
        page: req.query.page,
        limit: req.query.limit,
        name: req.query.name,
        email: req.query.email,
        minGrade: req.query.minGrade,
        maxGrade: req.query.maxGrade,
        sortBy: req.query.sortBy,
        order: req.query.order,
        fields: req.query.fields,
      })
    : `students:${JSON.stringify(req.query || {})}`;

  // Try to get data from cache
  const cachedData = cacheService.get ? cacheService.get(cacheKey) : null;
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  // Pagination params
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Fields projection
  const fields = req.query.fields
    ? req.query.fields.split(",").reduce((acc, field) => {
        acc[field] = 1;
        return acc;
      }, {})
    : null;

  // Build match query
  const matchQuery = { role: "student" };

  if (req.query.name) {
    matchQuery.name = { $regex: req.query.name, $options: "i" };
  }
  if (req.query.email) {
    matchQuery.email = { $regex: req.query.email, $options: "i" };
  }
  if (req.query.minGrade || req.query.maxGrade) {
    matchQuery.averageGrade = {};
    if (req.query.minGrade) matchQuery.averageGrade.$gte = parseFloat(req.query.minGrade);
    if (req.query.maxGrade) matchQuery.averageGrade.$lte = parseFloat(req.query.maxGrade);
  }

  const sortField = req.query.sortBy || "name";
  const sortOrder = req.query.order === "desc" ? -1 : 1;
  const sortStage = { $sort: { [sortField]: sortOrder } };

  const totalCount = await User.countDocuments(matchQuery);
  const totalPages = Math.ceil(totalCount / limit);

  const students = await User.aggregate([
    { $match: matchQuery },
    { $project: fields ? { ...fields, password: 0 } : { password: 0 } },
    {
      $lookup: {
        from: "grades",
        localField: "_id",
        foreignField: "student",
        as: "grades",
      },
    },
    {
      $lookup: {
        from: "classes",
        localField: "_id",
        foreignField: "students",
        as: "classes",
      },
    },
    {
      $lookup: {
        from: "badges",
        localField: "_id",
        foreignField: "user",
        as: "badges",
      },
    },
    {
      $addFields: {
        gradesCount: { $size: "$grades" },
        classesCount: { $size: "$classes" },
        badgesCount: { $size: "$badges" },
        averageGrade: { $avg: "$grades.score" },
      },
    },
    sortStage,
    { $skip: skip },
    { $limit: limit },
  ]);

  if (students.length === 0 && page === 1) {
    return res.status(404).json({ message: "No students found." });
  }

  const responseData = {
    students,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    filters: {
      name: req.query.name,
      email: req.query.email,
      minGrade: req.query.minGrade,
      maxGrade: req.query.maxGrade,
    },
    sorting: {
      field: sortField,
      order: req.query.order || "asc",
    },
    fields: fields ? Object.keys(fields) : "all",
  };

  cacheService.set ? cacheService.set(cacheKey, responseData, 300) : null;

  res.status(200).json(responseData);
});

/**
 * @desc    Get single student profile (aggregated)
 * @route   GET /api/students/:id
 * @access  Private (Self or Admin/Teacher)
 */
export const getStudentById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Cache key
  const cacheKey = `student:${userId}`;
  const cachedData = cacheService.get ? cacheService.get(cacheKey) : null;
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  // Authorization: self or admin/teacher
  if (req.user._id.toString() !== userId && req.user.role !== "admin" && req.user.role !== "teacher") {
    res.status(403);
    throw new Error("Not authorized to view this profile.");
  }

  const studentAgg = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
        role: "student",
      },
    },
    { $project: { password: 0 } },
    {
      $lookup: {
        from: "grades",
        localField: "_id",
        foreignField: "student",
        as: "grades",
      },
    },
    {
      $lookup: {
        from: "classes",
        localField: "_id",
        foreignField: "students",
        as: "classes",
      },
    },
    {
      $lookup: {
        from: "badges",
        localField: "_id",
        foreignField: "user",
        as: "badges",
      },
    },
    {
      $addFields: {
        gradesCount: { $size: "$grades" },
        classesCount: { $size: "$classes" },
        badgesCount: { $size: "$badges" },
        averageGrade: { $avg: "$grades.score" },
      },
    },
  ]).exec();

  if (studentAgg && studentAgg[0]) {
    cacheService.set ? cacheService.set(cacheKey, studentAgg[0], 300) : null;
    res.status(200).json(studentAgg[0]);
  } else {
    res.status(404);
    throw new Error("Student not found.");
  }
});

/**
 * @desc    Update student profile
 * @route   PUT /api/students/:id
 * @access  Private (Self, Admin, or Teacher)
 *
 * Accepts body fields (partial updates allowed):
 *  - name, department, class, year, rollNumber, weakestSubject, note
 *  - modifiedBy (optional) { id, name, role } - but server will fall back to req.user
 */
export const updateStudentProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const {
    name,
    department,
    class: studentClass,
    year,
    rollNumber,
    weakestSubject,
    // allow note and modifiedBy
    note,
    modifiedBy: modifiedByFromClient,
    // Do NOT allow role changes except via admin routes
    role: roleFromClient,
  } = req.body;

  const userToUpdate = await User.findById(userId);

  if (!userToUpdate || userToUpdate.role !== "student") {
    res.status(404);
    throw new Error("Student not found.");
  }

  // Authorization: allow self, admin, teacher
  const requesterId = req.user._id.toString();
  const requesterRole = req.user.role;

  const isSelf = requesterId === userId;
  const isAdmin = requesterRole === "admin";
  const isTeacher = requesterRole === "teacher";

  // Teachers are allowed to update student profile (business rule here).
  // If you need to restrict teachers to only students they teach, implement that check here.
  if (!isSelf && !isAdmin && !isTeacher) {
    res.status(403);
    throw new Error("Not authorized to update this profile.");
  }

  // Prevent role changes unless admin
  if (roleFromClient && roleFromClient !== "student" && !isAdmin) {
    res.status(403);
    throw new Error("Role update restricted.");
  }

  // Apply updates (only allowed fields)
  if (typeof name === "string") userToUpdate.name = name;
  if (typeof department === "string") userToUpdate.department = department;
  if (typeof studentClass === "string") userToUpdate.class = studentClass;
  if (typeof year === "string") userToUpdate.year = year;
  if (typeof rollNumber === "string") userToUpdate.rollNumber = rollNumber;
  if (typeof weakestSubject === "string") userToUpdate.weakestSubject = weakestSubject;
  if (roleFromClient && isAdmin) userToUpdate.role = roleFromClient;

  // Build lastModified object
  const modifier = modifiedByFromClient && modifiedByFromClient.id
    ? {
        id: modifiedByFromClient.id,
        name: modifiedByFromClient.name || req.user.name,
        role: modifiedByFromClient.role || req.user.role,
      }
    : {
        id: requesterId,
        name: req.user.name,
        role: requesterRole,
      };

  userToUpdate.lastModified = {
    by: modifier,
    at: new Date().toISOString(),
    note: note || `Updated by ${modifier.name} (${modifier.role})`,
  };

  // Save
  await userToUpdate.save();

  // Invalidate cache for this student & student lists
  safeInvalidateCache(`student:${userId}`);
  safeInvalidateCache("students:all"); // generic key if used
  // if cache keys are generated differently, you may want to invalidate more keys based on your cacheService implementation

  // Return aggregated updated student (same shape as GET)
  const studentAgg = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
        role: "student",
      },
    },
    { $project: { password: 0 } },
    {
      $lookup: {
        from: "grades",
        localField: "_id",
        foreignField: "student",
        as: "grades",
      },
    },
    {
      $lookup: {
        from: "classes",
        localField: "_id",
        foreignField: "students",
        as: "classes",
      },
    },
    {
      $lookup: {
        from: "badges",
        localField: "_id",
        foreignField: "user",
        as: "badges",
      },
    },
    {
      $addFields: {
        gradesCount: { $size: "$grades" },
        classesCount: { $size: "$classes" },
        badgesCount: { $size: "$badges" },
        averageGrade: { $avg: "$grades.score" },
      },
    },
  ]).exec();

  if (studentAgg && studentAgg[0]) {
    // Re-cache new data for 5 minutes
    cacheService.set ? cacheService.set(`student:${userId}`, studentAgg[0], 300) : null;
    res.status(200).json(studentAgg[0]);
  } else {
    res.status(500);
    throw new Error("Student updated but failed to return aggregated data.");
  }
});

/**
 * @desc    Delete student profile
 * @route   DELETE /api/students/:id
 * @access  Private (Admin only)
 */
export const deleteStudent = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const studentToDelete = await User.findById(userId);

  if (!studentToDelete || studentToDelete.role !== "student") {
    res.status(404);
    throw new Error("Student not found.");
  }

  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only administrators can delete student profiles.");
  }

  await User.deleteOne({ _id: userId });

  // Invalidate caches
  safeInvalidateCache(`student:${userId}`);
  safeInvalidateCache("students:all");

  res.status(200).json({
    message: `Student with ID ${userId} deleted successfully.`,
  });
});
