import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['Student', 'Faculty Admin'],
      default: 'Student',
    },
    indexNumber: {
      type: String,
      required: function() { return this.role === 'Student'; }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;