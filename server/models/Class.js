import mongoose from 'mongoose';

const ClassSchema = mongoose.Schema({
    // Name of the class instance (e.g., "Algebra 1 - Period 3")
    name: {
        type: String,
        required: true,
        trim: true,
    },
    // Reference to the general subject (e.g., "Mathematics")
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject', // Links to the Subject model
    },
    // Reference to the teacher assigned to this specific class section
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Links to the User model (role should be 'teacher')
    },
    // The academic term/semester this class is held
    term: {
        type: String,
        required: true,
        enum: ['Q1', 'Q2', 'Q3', 'Q4', 'Semester 1', 'Semester 2', 'Full Year'],
        default: 'Full Year',
    },
    // Year this class is active (e.g., 2025)
    year: {
        type: Number,
        required: true,
        default: () => new Date().getFullYear(),
    },
    // Array of students enrolled in this class
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the User model (role should be 'student')
    }],
    // Optional: a specific meeting time or schedule string
    schedule: {
        type: String,
        required: false,
        trim: true,
    },
}, {
    timestamps: true,
});

// Optional: Add a compound index to ensure no duplicate class sections (same subject, teacher, and term)
ClassSchema.index({ subject: 1, teacher: 1, term: 1, year: 1 }, { unique: true });


const Class = mongoose.model('Class', ClassSchema);

// CRITICAL FIX: Use ES Module default export
export default Class;