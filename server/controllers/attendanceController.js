import asyncHandler from "express-async-handler";
import Attendance from "../models/Attendance.js";

// @route   POST /api/attendance
// @access  Teacher, Admin
export const markAttendance = asyncHandler(async (req, res) => {
    const { date, students } = req.body; // students: [{ studentId, status }]

    if (!date || !students || !Array.isArray(students)) {
        res.status(400);
        throw new Error("Invalid attendance data");
    }

    const attendanceRecords = [];

    for (const record of students) {
        const { studentId, status } = record;

        // Upsert attendance
        const attendance = await Attendance.findOneAndUpdate(
            { student: studentId, date: new Date(date) },
            {
                student: studentId,
                date: new Date(date),
                present: status === "present", // simplified for now, can extend for 'late'
                markedBy: req.user._id,
                note: status
            },
            { new: true, upsert: true }
        );
        attendanceRecords.push(attendance);
    }

    res.status(200).json({
        success: true,
        message: "Attendance marked successfully",
        data: attendanceRecords,
    });
});

// @route   GET /api/attendance
// @access  Teacher, Admin
export const getAttendance = asyncHandler(async (req, res) => {
    const { date, studentId } = req.query;
    const filter = {};

    if (date) {
        filter.date = new Date(date);
    }
    if (studentId) {
        filter.student = studentId;
    }

    // Teachers only see their class/students? For now allow all or scoped by query

    const attendance = await Attendance.find(filter)
        .populate("student", "name rollNo")
        .sort({ date: -1 });

    res.status(200).json({
        success: true,
        data: attendance,
    });
});
