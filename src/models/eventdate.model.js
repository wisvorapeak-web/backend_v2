const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  event: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
  display_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('EventDate', schema);
