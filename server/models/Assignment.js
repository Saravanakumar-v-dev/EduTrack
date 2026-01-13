import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "approved", "rejected"],
        default: "pending",
    },
    grade: {
        type: Number,
        min: 0,
        max: 100,
    },
    feedback: {
        type: String,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    reviewedAt: {
        type: Date,
    },
});

const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Assignment title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Assignment description is required"],
        },
        subject: {
            type: String,
            required: true,
        },
        class: {
            type: String,
        },
        section: {
            type: String,
        },
        dueDate: {
            type: Date,
            required: [true, "Due date is required"],
        },
        maxScore: {
            type: Number,
            default: 100,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        attachments: [
            {
                fileName: String,
                fileUrl: String,
                fileType: String,
            },
        ],
        submissions: [submissionSchema],
        status: {
            type: String,
            enum: ["active", "closed", "draft"],
            default: "active",
        },
        allowLateSubmissions: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Virtual for submission count
assignmentSchema.virtual("submissionCount").get(function () {
    return this.submissions.length;
});

// Check if assignment is overdue
assignmentSchema.virtual("isOverdue").get(function () {
    return new Date() > this.dueDate;
});

assignmentSchema.set("toJSON", { virtuals: true });
assignmentSchema.set("toObject", { virtuals: true });

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
