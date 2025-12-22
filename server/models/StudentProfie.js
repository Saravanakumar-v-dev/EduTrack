import mongoose from 'mongoose';

const StudentProfileSchema = mongoose.Schema({
    // CRITICAL: Link to the main User account (where login credentials are)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Links to the User model
        unique: true, // One profile per user
    },
    studentId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    currentGradeLevel: {
        type: String,
        required: true,
        enum: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'College Prep'],
    },
    enrollmentStatus: {
        type: String,
        required: true,
        default: 'Active',
        enum: ['Active', 'Graduated', 'Withdrawn', 'On Leave'],
    },
    // Example of a field not on the main User model
    guardianName: {
        type: String,
    },
    guardianContact: {
        type: String,
    },
    // Array of currently enrolled class references
    enrolledClasses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class', // Assuming you have a 'Class' model
    }],
}, {
    timestamps: true,
});

const StudentProfile = mongoose.model('StudentProfile', StudentProfileSchema);

// CRITICAL FIX: Use ES Module default export
export default StudentProfile;