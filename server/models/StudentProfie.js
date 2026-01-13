import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One profile per student
      index: true,
    },

    rollNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    department: {
      type: String,
      trim: true, // IT, CSE, ECE
    },

    year: {
      type: String,
      trim: true, // 1st, 2nd, Final
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },

    weakestSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },

    strengths: [
      {
        type: String,
        trim: true,
      },
    ],

    guardianName: {
      type: String,
      trim: true,
    },

    guardianContact: {
      type: String,
      trim: true,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    lastModified: {
      by: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        role: String,
      },
      at: Date,
    },
  },
  {
    timestamps: true,
  }
);

const StudentProfile = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);
export default StudentProfile;
