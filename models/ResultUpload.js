import mongoose from 'mongoose';

const VALID_GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E', 'F'];

const AuditLogEntrySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: String, default: 'Admin' },
    performedAt: { type: Date, default: Date.now },
    details: { type: String, default: '' },
  },
  { _id: false }
);

const GradeEntrySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required.'],
    },
    grade: {
      type: String,
      enum: {
        values: VALID_GRADES,
        message: '{VALUE} is not a valid grade.',
      },
      required: [true, 'Grade is required for each student.'],
    },
  },
  { _id: false }
);

const ResultUploadSchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: [true, 'Academic year is required.'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required.'],
      trim: true,
    },
    batch: {
      type: String,
      required: [true, 'Batch is required.'],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, 'Semester is required.'],
      trim: true,
    },
    subjectCode: {
      type: String,
      required: [true, 'Subject code is required.'],
      trim: true,
    },
    subjectName: {
      type: String,
      required: [true, 'Subject name is required.'],
      trim: true,
    },
    credits: {
      type: Number,
      required: [true, 'Credits value is required.'],
      min: [1, 'Credits must be at least 1.'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    entries: [GradeEntrySchema],
    publishedAt: {
      type: Date,
      default: null,
    },
    publishedBy: {
      type: String,
      default: null,
    },
    auditLog: [AuditLogEntrySchema],
  },
  { timestamps: true }
);

// Prevent duplicate uploads for the same subject in a given context
ResultUploadSchema.index(
  { academicYear: 1, department: 1, batch: 1, semester: 1, subjectCode: 1 },
  { unique: true }
);

export default mongoose.models.ResultUpload ||
  mongoose.model('ResultUpload', ResultUploadSchema);
