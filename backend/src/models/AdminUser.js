const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['super_admin', 'hotel_owner', 'operations', 'support_agent'],
      required: true,
    },
    roleLabel: {
      type: String,
    },
    badge: {
      type: String,
    },
    avatar: {
      type: String,
    },
    hotelAccess: {
      type: String,
      default: 'all',
    },
    pin: {
      type: String,
      select: false,
    },
    requires2FA: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.pin;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// email already indexed via unique:true in schema definition

adminUserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  if (this.isModified('pin') && this.pin) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

adminUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminUserSchema.methods.comparePin = async function (candidatePin) {
  return bcrypt.compare(candidatePin, this.pin);
};

module.exports = mongoose.model('AdminUser', adminUserSchema);
