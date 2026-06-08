const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  quote: { type: String, required: true },
  avatar: { type: String },
  rating: { type: Number, default: 5 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', schema);
