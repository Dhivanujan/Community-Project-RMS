import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Result must be assigned to a student.']
    },
    semester: {
        type: String,
        required: [true, 'Please specify the semester.']
    },
    gpa: {
        type: Number,
        required: [true, 'GPA is required.']
    },
    totalCredits: {
        type: Number,
        default: 0
    },
    subjects: [{
        subjectName: { type: String },
        grade: { type: String },
        credits: { type: Number }
    }]
}, { timestamps: true });

export default mongoose.models.Result || mongoose.model('Result', ResultSchema);
