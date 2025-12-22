import mongoose from 'mongoose';

const AttendanceSchema = mongoose.Schema({
    // Reference to the User (Student) who this record belongs to
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', 
    },
    // Reference to the Class or Subject the attendance is for
    class: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Class', // Assuming you have a ClassModel
    },
    // The specific date of the attendance record
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    // Status of attendance: Present, Absent, Tardy
    status: {
        type: String,
        required: true,
        enum: ['Present', 'Absent', 'Tardy'],
        default: 'Present',
    },
    // Optional notes, e.g., reason for absence
    notes: {
        type: String,
        required: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Enforce unique attendance record per student per day per class (optional but useful)
AttendanceSchema.index({ student: 1, class: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', AttendanceSchema);

// CRITICAL FIX: Use ES Module default export
export default Attendance;