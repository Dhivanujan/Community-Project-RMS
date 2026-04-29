import mongoose from 'mongoose';

const StudentNotificationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['results', 'academic', 'general'],
      default: 'general',
    },
    category: {
      type: String,
      enum: ['Results', 'Academic', 'General'],
      default: 'General',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    sourceResultId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Result',
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

StudentNotificationSchema.index(
  { student: 1, sourceResultId: 1 },
  { unique: true, partialFilterExpression: { sourceResultId: { $type: 'objectId' } } }
);

export default mongoose.models.StudentNotification ||
  mongoose.model('StudentNotification', StudentNotificationSchema);
