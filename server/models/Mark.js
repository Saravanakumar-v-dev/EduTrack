import mongoose from 'mongoose';

const MarkSchema = mongoose.Schema({
    // Link to the student who received the mark
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Links to the main User model (where the student is defined)
    },
    // Link to the subject the mark is for
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject',
    },
    // The numerical score or percentage received
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Assuming a percentage score
    },
    // Letter grade (e.g., A, B, C) derived from the score
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
    // Date the assessment was recorded
    dateRecorded: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});


// Helper method to automatically calculate letter grade
MarkSchema.methods.calculateLetterGrade = function() {
    if (this.score >= 90) return 'A';
    if (this.score >= 80) return 'B';
    if (this.score >= 70) return 'C';
    if (this.score >= 60) return 'D';
    return 'F';
};


// Pre-save hook to ensure letterGrade is set automatically
MarkSchema.pre('save', function(next) {
    if (this.isModified('score') && this.score !== undefined) {
        this.letterGrade = this.calculateLetterGrade();
    }
    next();
});

const Mark = mongoose.model('Mark', MarkSchema);

// CRITICAL: Use ES Module default export
export default Mark;