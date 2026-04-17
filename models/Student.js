import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please provide a name for the student.'] 
    },
    rollNumber: { 
        type: String, 
        required: [true, 'Please provide a roll/index number.'],
        unique: true
    },
    email: { 
        type: String, 
        required: [true, 'Please provide an email.'],
        unique: true
    },
    department: { 
        type: String 
    },
    enrollmentYear: { 
        type: String 
    }
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
