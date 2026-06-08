const mongoose = require('mongoose');

const schema = new mongoose.Schema({ 
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  country: { type: String },
  subject: { type: String, default: 'Brochure Download' }, 
  sender: { type: String }, // optional, for legacy/backward compatibility
  status: { type: String, enum: ['Unread', 'Read'], default: 'Unread' } 
}, { timestamps: true });

module.exports = mongoose.model('Inbox', schema);
