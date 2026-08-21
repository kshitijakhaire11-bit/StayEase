const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    logId: { type: String, required: true, unique: true },
    timestamp: { type: String },
    user: { type: String, required: true },
    role: { type: String },
    action: { type: String, required: true },
    entity: { type: String },
    entityId: { type: String },
    ipAddress: { type: String },
    severity: {
      type: String,
      enum: ['info', 'warning', 'error'],
      default: 'info',
    },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
