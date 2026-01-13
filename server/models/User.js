import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,  // Allows null/undefined for phone-only users
      lowercase: true,
      index: true,
    },

    // Phone number for Firebase Auth
    phone: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    // Firebase UID for phone-authenticated users
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    password: {
      type: String,
      required: function () {
        // Password required ONLY for email-based verification
        return this.isVerified === true && !this.firebaseUid;
      },
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // OTP used for email registration & reset
    verificationOtp: {
      type: String,
      select: false,
    },

    otpExpires: {
      type: Date,
      select: false,
    },

    // Teacher assignment (for students)
    assignedTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true }
);

/* ======================================================
   PASSWORD HASHING
====================================================== */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ======================================================
   PASSWORD COMPARISON
====================================================== */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
