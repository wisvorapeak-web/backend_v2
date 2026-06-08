const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  registration_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  gateway: { type: String, enum: ['Razorpay', 'PayPal'] },
  gateway_order_id: { type: String },
  gateway_payment_id: { type: String },
  status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  error_details: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', schema);
