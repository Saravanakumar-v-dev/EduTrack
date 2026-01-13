import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true, // e.g., CS101
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // role: teacher
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
