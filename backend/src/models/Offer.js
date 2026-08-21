const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    offerId: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    title: { type: String, required: true },
    description: { type: String },
    discountType: {
      type: String,
      enum: ['Percentage', 'Flat'],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    minSpend: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    validFrom: { type: String, required: true },
    validUntil: { type: String, required: true },
    usageCount: { type: Number, default: 0 },
    usageLimit: { type: Number, default: 1000 },
    isActive: { type: Boolean, default: true },
    applicableTier: { type: String },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret) { delete ret.__v; return ret; } },
  }
);

// code already indexed via unique:true — add isActive for filtering
offerSchema.index({ isActive: 1 });

module.exports = mongoose.model('Offer', offerSchema);
