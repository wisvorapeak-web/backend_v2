const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  university: { type: String },
  country: { type: String },
  image_url: { type: String },
  linkedin_url: { type: String },
  bio: { type: String },
  category: { type: String, enum: ['Team', 'Leader', 'Organizer'], default: 'Team' },
  display_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', schema);
