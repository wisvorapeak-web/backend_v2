const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  imageUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('VenueGallery', schema);
