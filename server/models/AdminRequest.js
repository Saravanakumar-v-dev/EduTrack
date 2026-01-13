import mongoose from "mongoose";

const adminRequestSchema = new mongoose.Schema(
    {
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["data_access", "student_transfer", "feature_request", "permission", "other"],
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            index: true,
        },
        adminComment: {
            type: String,
            trim: true,
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // admin who resolved it
        }
    },
    {
        timestamps: true,
    }
);

const AdminRequest = mongoose.model("AdminRequest", adminRequestSchema);
export default AdminRequest;
