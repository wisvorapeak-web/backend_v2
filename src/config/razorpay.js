const Razorpay = require('razorpay');

// Initialize Razorpay instance
let razorpayInstance = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay configured');
  } else {
    console.warn('Razorpay keys not found in environment variables');
  }
} catch (error) {
  console.error('Error configuring Razorpay:', error.message);
}

module.exports = razorpayInstance;
