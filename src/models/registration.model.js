const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
  name: { type: String, required: true },
  email: { type: String, required: true },
  organization: { type: String },
  package_name: { type: String, required: true },
  accommodation_name: { type: String },
  accompanying_guests: { type: Number, default: 0 },
  total_amount: { type: Number, required: true },
  payment_status: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  payment_method: { type: String },
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' } 
}, { timestamps: true });

module.exports = mongoose.model('Registration', schema);
