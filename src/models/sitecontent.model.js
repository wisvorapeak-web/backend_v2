const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  section: { type: String, required: true, unique: true }, // 'hero', 'about'
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', schema);
