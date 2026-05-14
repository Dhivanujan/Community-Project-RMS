import mongoose from 'mongoose';

const staffProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    department: {
      type: String,
    },
    designation: {
      type: String,
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    phoneNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

const StaffProfile = mongoose.models.StaffProfile || mongoose.model('StaffProfile', staffProfileSchema);

export default StaffProfile;
