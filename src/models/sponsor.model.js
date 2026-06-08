const mongoose = require('mongoose');

const schema = new mongoose.Schema({ name: { type: String, required: true }, tier: { type: String, enum: ['Platinum', 'Gold', 'Silver', 'Bronze'], default: 'Silver' }, logoUrl: { type: String }, websiteUrl: { type: String }, description: { type: String } }, { timestamps: true });

module.exports = mongoose.model('Sponsor', schema);
