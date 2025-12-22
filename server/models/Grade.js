import mongoose from 'mongoose';

const GradeSchema = mongoose.Schema({
    // Link to the student who received the grade
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Assuming student data is stored in the 'User' collection
    },
    // Link to the subject the grade is for
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject',
    },
    // Link to the class/course instance (optional, but good for tracking)
    class: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, // Could be optional if tracking against only subject
        ref: 'Class',
    },
    // Numerical score or percentage
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Assuming a percentage score
    },
    // Letter grade (e.g., A, B, C)
    letterGrade: {
        type: String,
        required: false,
    },
    // Term or Semester (e.g., 'Q1', 'Semester 1')
    term: {
        type: String,
        required: true,
        trim: true,
    },
    // Type of assessment (e.g., 'Exam', 'Homework', 'Final Project')
    assessmentType: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});


// Optional: Method to automatically calculate letter grade based on score (pre-save hook is better)
GradeSchema.methods.calculateLetterGrade = function() {
    if (this.score >= 90) return 'A';
    if (this.score >= 80) return 'B';
    if (this.score >= 70) return 'C';
    if (this.score >= 60) return 'D';
    return 'F';
};


// Pre-save hook to ensure letterGrade is set if a score is provided
GradeSchema.pre('save', function(next) {
    if (this.isModified('score') && this.score !== undefined) {
        this.letterGrade = this.calculateLetterGrade();
    }
    next();
});

const Grade = mongoose.model('Grade', GradeSchema);

// CRITICAL FIX: Use ES Module default export, which solves the recurring error
export default Grade;