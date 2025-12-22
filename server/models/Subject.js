import mongoose from 'mongoose';

const SubjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
    },
    // Reference to the teacher assigned to this subject (User model)
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, // Subject can exist without an assigned teacher initially
        ref: 'User',
    },
}, {
    timestamps: true,
});


const Subject = mongoose.model('Subject', SubjectSchema);

// CRITICAL FIX: Use ES Module default export
export default Subject;