import mongoose from "mongoose";

const markSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    examType: {
      type: String,
      enum: ["internal", "midterm", "final", "assignment", "lab"],
      required: true,
    },

    examDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // teacher/admin
      required: true,
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  }
);

/* ======================================================
   CONSTRAINTS
====================================================== */
/**
 * Prevent duplicate mark entry:
 * Same student + subject + examType + date
 */
markSchema.index(
  { student: 1, subject: 1, examType: 1, examDate: 1 },
  { unique: true }
);

const Mark = mongoose.model("Mark", markSchema);
export default Mark;
