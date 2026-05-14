import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema(
  {
    sessionTimeout: {
      type: Number,
      default: 120, // in minutes
    },
    passwordPolicy: {
      minLength: { type: Number, default: 8 },
      requireUppercase: { type: Boolean, default: true },
      requireNumbers: { type: Boolean, default: true },
      requireSpecialChars: { type: Boolean, default: true },
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maxLoginAttempts: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

const SystemSettings = mongoose.models.SystemSettings || mongoose.model('SystemSettings', systemSettingsSchema);

export default SystemSettings;
