import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    present: {
      type: Boolean,
      required: true,
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // teacher or admin
      required: true,
    },

    note: {
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
 * Prevent duplicate attendance:
 * One student → one record per date
 */
attendanceSchema.index(
  { student: 1, date: 1 },
  { unique: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
