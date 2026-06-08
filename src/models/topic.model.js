const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
  title: { type: String, required: true }, 
  description: { type: String }, 
  icon_name: { type: String },
  image_url: { type: String },
  color_gradient: { type: String },
  display_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Topic', schema);
