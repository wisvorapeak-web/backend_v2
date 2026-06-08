const mongoose = require('mongoose');

const schema = new mongoose.Schema({ name: { type: String, required: true }, address: { type: String, required: true }, mapUrl: { type: String }, description: { type: String }, images: [{ type: String }] }, { timestamps: true });

module.exports = mongoose.model('Venue', schema);
