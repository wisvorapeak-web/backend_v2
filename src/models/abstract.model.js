const mongoose = require('mongoose');

const schema = new mongoose.Schema({ title: { type: String, required: true }, author: { type: String, required: true }, status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' } }, { timestamps: true });

module.exports = mongoose.model('Abstract', schema);
