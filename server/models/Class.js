import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50, // e.g., "10-A", "CSE-B"
    },

    academicYear: {
      type: String,
      required: true, // e.g., "2024-2025"
      index: true,
    },

    department: {
      type: String,
      trim: true, // IT, CSE, ECE, etc.
    },

    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
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
 * Prevent duplicate class names in the same academic year
 * Example: Two "10-A" classes in 2024-2025 not allowed
 */
classSchema.index(
  { name: 1, academicYear: 1 },
  { unique: true }
);

const Class = mongoose.model("Class", classSchema);
export default Class;
