import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    type: {
      type: String,
      enum: [
        "attendance",
        "performance",
        "improvement",
        "discipline",
        "participation",
        "special",
      ],
      default: "performance",
    },

    icon: {
      type: String,
      default: "🏅", // can be emoji or icon key
    },

    awardedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // teacher or admin
      required: true,
    },

    awardedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/* ======================================================
   OPTIONAL SAFETY: PREVENT DUPLICATE BADGES
====================================================== */
/**
 * Prevent same badge title being awarded twice
 * to the same user.
 */
badgeSchema.index(
  { user: 1, title: 1 },
  { unique: true }
);

const Badge = mongoose.model("Badge", badgeSchema);
export default Badge;
