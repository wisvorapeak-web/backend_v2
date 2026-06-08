const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  affiliation: { type: String },
  location: { type: String },
  image_url: { type: String },
  linkedin_url: { type: String },
  category: { type: String, enum: ['Scientific Committee', 'Chairs'], default: 'Scientific Committee' },
  display_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Organizer', schema);
