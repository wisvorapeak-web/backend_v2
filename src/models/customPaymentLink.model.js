const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['INR', 'USD'], default: 'USD' },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('CustomPaymentLink', schema);
