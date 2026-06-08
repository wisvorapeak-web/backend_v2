const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: '$' },
  description: { type: String },
  features: [{ type: String }],
  is_popular: { type: Boolean, default: false },
  display_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Pricing', schema);
