const mongoose = require('mongoose');

const schema = new mongoose.Schema({ registrationId: { type: String, required: true }, amount: { type: String }, reason: { type: String } }, { timestamps: true });

module.exports = mongoose.model('FailedPayment', schema);
