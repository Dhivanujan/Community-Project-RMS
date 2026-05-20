import mongoose from 'mongoose';

const GpaReportSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  studentId: { 
    type: String,
    required: true,
    unique: true
  },
  studentName: {
    type: String,
    required: true
  },
  batch: { 
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  publishedSubjects: [{
    type: String
  }],
  grades: [{
    type: String
  }],
  credits: [{
    type: Number
  }],
  totalCredits: {
    type: Number,
    required: true,
    default: 0
  },
  currentGPA: {
    type: Number,
    required: true,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.models.GpaReport || mongoose.model('GpaReport', GpaReportSchema);
