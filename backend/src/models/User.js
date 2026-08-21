const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      select: false, // Never return password by default
    },
    tier: {
      type: String,
      enum: ['Welcome', 'Silver', 'Gold', 'StayEase Elite Black'],
      default: 'Welcome',
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSpend: {
      type: Number,
      default: 0,
      min: 0,
    },
    kycStatus: {
      type: String,
      default: 'Pending Verification',
    },
    city: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    language: {
      type: String,
      default: 'English (India)',
    },
    favoriteHotel: {
      type: String,
    },
    dietaryPreference: {
      type: String,
    },
    specialPreferences: [String],
    tags: [String],
    avatar: {
      type: String,
    },

    // OTP fields
    otp: {
      type: String,
      select: false,
    },
    otpExpiresAt: {
      type: Date,
      select: false,
    },
    otpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    // Password reset
    passwordResetOtp: {
      type: String,
      select: false,
    },
    passwordResetExpiresAt: {
      type: Date,
      select: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.otp;
        delete ret.otpExpiresAt;
        delete ret.otpAttempts;
        delete ret.passwordResetOtp;
        delete ret.passwordResetExpiresAt;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// email already indexed via unique:true — add phone index for lookup
userSchema.index({ phone: 1 });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
