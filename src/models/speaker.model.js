const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  university: { type: String },
  country: { type: String },
  image_url: { type: String },
  linkedin_url: { type: String },
  bio: { type: String },
  category: { type: String },
  display_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Speaker', schema);
