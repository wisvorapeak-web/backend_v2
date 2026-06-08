const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Razorpay
router.post('/razorpay/create-order', paymentController.createRazorpayOrder);
router.post('/razorpay/verify', paymentController.verifyRazorpayPayment);

// PayPal
router.post('/paypal/create-order', paymentController.createPaypalOrder);
router.post('/paypal/capture', paymentController.capturePaypalOrder);

// Failed tracking
router.post('/failed', paymentController.recordFailedPayment);
router.get('/failed', paymentController.getFailedPayments);

module.exports = router;
