import asyncHandler from "express-async-handler";
import AdminRequest from "../models/AdminRequest.js";

// @route   POST /api/requests
// @access  Teacher
export const createRequest = asyncHandler(async (req, res) => {
    const { type, message } = req.body;

    if (!type || !message) {
        res.status(400);
        throw new Error("Type and message are required");
    }

    const request = await AdminRequest.create({
        requester: req.user._id,
        type,
        message,
    });

    res.status(201).json({
        success: true,
        message: "Request sent successfully",
        data: request,
    });
});

// @route   GET /api/requests
// @access  Admin (all), Teacher (own)
export const getRequests = asyncHandler(async (req, res) => {
    const filter = {};

    if (req.user.role === "teacher") {
        filter.requester = req.user._id;
    }

    const requests = await AdminRequest.find(filter)
        .populate("requester", "name email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: requests,
    });
});

// @route   PUT /api/requests/:id
// @access  Admin
export const updateRequestStatus = asyncHandler(async (req, res) => {
    const { status, adminComment } = req.body;
    const { id } = req.params;

    const request = await AdminRequest.findById(id);

    if (!request) {
        res.status(404);
        throw new Error("Request not found");
    }

    request.status = status || request.status;
    request.adminComment = adminComment || request.adminComment;
    if (status === "resolved" || status === "rejected" || status === "approved") {
        request.resolvedBy = req.user._id;
    }

    const updatedRequest = await request.save();

    res.status(200).json({
        success: true,
        message: "Request updated",
        data: updatedRequest,
    });
});
