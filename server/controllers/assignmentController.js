import asyncHandler from "express-async-handler";
import Assignment from "../models/Assignment.js";

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
export const getAssignments = asyncHandler(async (req, res) => {
    const { role, _id: userId } = req.user;

    let query = {};

    // Students see only active assignments for their class
    if (role === "student") {
        query.status = "active";
    }

    // Teachers see their own assignments
    if (role === "teacher") {
        query.createdBy = userId;
    }

    // Admins see all
    const assignments = await Assignment.find(query)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });

    res.json(assignments);
});

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
export const getAssignment = asyncHandler(async (req, res) => {
    const assignment = await Assignment.findById(req.params.id)
        .populate("createdBy", "name email")
        .populate("submissions.student", "name email")
        .populate("submissions.reviewedBy", "name email");

    if (!assignment) {
        res.status(404);
        throw new Error("Assignment not found");
    }

    res.json(assignment);
});

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private (Teacher/Admin)
export const createAssignment = asyncHandler(async (req, res) => {
    const { title, description, subject, dueDate, maxScore, class: className, section, allowLateSubmissions, attachments } = req.body;

    const assignment = await Assignment.create({
        title,
        description,
        subject,
        dueDate,
        maxScore: maxScore || 100,
        class: className,
        section,
        allowLateSubmissions: allowLateSubmissions || false,
        attachments: attachments || [],
        createdBy: req.user._id,
    });

    res.status(201).json(assignment);
});

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Teacher/Admin)
export const updateAssignment = asyncHandler(async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
        res.status(404);
        throw new Error("Assignment not found");
    }

    // Only creator or admin can update
    if (assignment.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to update this assignment");
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updatedAssignment);
});

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Teacher/Admin)
export const deleteAssignment = asyncHandler(async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
        res.status(404);
        throw new Error("Assignment not found");
    }

    // Only creator or admin can delete
    if (assignment.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to delete this assignment");
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res.json({ message: "Assignment deleted successfully" });
});

// @desc    Submit assignment (Student)
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
export const submitAssignment = asyncHandler(async (req, res) => {
    const { fileUrl, fileName, fileType } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
        res.status(404);
        throw new Error("Assignment not found");
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
        (sub) => sub.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
        // Update existing submission
        existingSubmission.fileUrl = fileUrl;
        existingSubmission.fileName = fileName;
        existingSubmission.fileType = fileType;
        existingSubmission.submittedAt = new Date();
        existingSubmission.status = "pending";
    } else {
        // Add new submission
        assignment.submissions.push({
            student: req.user._id,
            fileUrl,
            fileName,
            fileType,
        });
    }

    await assignment.save();

    res.json({ message: "Assignment submitted successfully", assignment });
});

// @desc    Review submission (Teacher/Admin)
// @route   PUT /api/assignments/:id/submissions/:submissionId/review
// @access  Private (Teacher/Admin)
export const reviewSubmission = asyncHandler(async (req, res) => {
    const { status, grade, feedback } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
        res.status(404);
        throw new Error("Assignment not found");
    }

    const submission = assignment.submissions.id(req.params.submissionId);

    if (!submission) {
        res.status(404);
        throw new Error("Submission not found");
    }

    submission.status = status;
    submission.grade = grade;
    submission.feedback = feedback;
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();

    await assignment.save();

    res.json({ message: "Submission reviewed successfully", assignment });
});

// @desc    Get my submissions (Student)
// @route   GET /api/assignments/my-submissions
// @access  Private (Student)
export const getMySubmissions = asyncHandler(async (req, res) => {
    const assignments = await Assignment.find({
        "submissions.student": req.user._id,
    })
        .populate("createdBy", "name email")
        .select("title subject dueDate maxScore submissions");

    // Filter to only include the student's submission
    const mySubmissions = assignments.map((assignment) => {
        const mySubmission = assignment.submissions.find(
            (sub) => sub.student.toString() === req.user._id.toString()
        );
        return {
            assignmentId: assignment._id,
            title: assignment.title,
            subject: assignment.subject,
            dueDate: assignment.dueDate,
            maxScore: assignment.maxScore,
            submission: mySubmission,
        };
    });

    res.json(mySubmissions);
});
