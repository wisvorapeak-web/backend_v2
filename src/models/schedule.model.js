const mongoose = require('mongoose');

const schema = new mongoose.Schema({ title: { type: String, required: true }, startTime: { type: String, required: true }, endTime: { type: String, required: true }, speakerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Speaker' }, description: { type: String }, location: { type: String } }, { timestamps: true });

module.exports = mongoose.model('Schedule', schema);
