import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // e.g., "Grade 10", "Semester 5"
    },

    year: {
      type: String,
      required: true, // e.g., "2024"
      index: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    description: {
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
 * Prevent duplicate grades within same class & year
 */
gradeSchema.index(
  { name: 1, year: 1, class: 1 },
  { unique: true }
);

const Grade = mongoose.model("Grade", gradeSchema);
export default Grade;
