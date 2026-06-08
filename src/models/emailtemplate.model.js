const mongoose = require('mongoose');

const schema = new mongoose.Schema({ name: { type: String, required: true }, subject: { type: String, required: true }, body: { type: String } }, { timestamps: true });

module.exports = mongoose.model('EmailTemplate', schema);
