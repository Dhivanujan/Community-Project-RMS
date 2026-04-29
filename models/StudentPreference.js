import mongoose from 'mongoose';

const StudentPreferenceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      unique: true,
      index: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
    resultAlerts: {
      type: Boolean,
      default: true,
    },
    academicUpdates: {
      type: Boolean,
      default: true,
    },
    generalNews: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light',
    },
  },
  { timestamps: true }
);

export default mongoose.models.StudentPreference ||
  mongoose.model('StudentPreference', StudentPreferenceSchema);
