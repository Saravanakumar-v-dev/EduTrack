import mongoose from 'mongoose';

const BadgeSchema = mongoose.Schema({
    // Name of the badge (e.g., "Perfect Attendance", "Honor Roll")
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    // Description of the criteria for earning the badge
    description: {
        type: String,
        required: true,
    },
    // The specific user who earned the badge
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Links to the User model (the student/recipient)
    },
    // The date the badge was awarded
    awardedOn: {
        type: Date,
        default: Date.now,
    },
    // Optional: The specific subject or area the badge relates to
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Subject',
    },
    // Optional: The awarding entity (e.g., 'Admin', 'Teacher', 'System')
    awardedBy: {
        type: String,
        required: false,
        default: 'System',
    },
}, {
    timestamps: true, // Includes createdAt and updatedAt
});

// Optional: Add a compound index to prevent the same badge from being awarded 
// to the same user on the same subject on the same day (or simply use the name/user combination)
BadgeSchema.index({ name: 1, user: 1 }, { unique: true });


const Badge = mongoose.model('Badge', BadgeSchema);

// CRITICAL FIX: Use ES Module default export
export default Badge;