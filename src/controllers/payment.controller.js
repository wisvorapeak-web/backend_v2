const Razorpay = require('razorpay');
const crypto = require('crypto');
const paypal = require('@paypal/checkout-server-sdk');
const Payment = require('../models/payment.model');
const Registration = require('../models/registration.model');
const emailService = require('../services/email.service');
require('dotenv').config();

// Razorpay Setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// PayPal Setup
const paypalEnvironment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID || '', 
  process.env.PAYPAL_CLIENT_SECRET || ''
);
const paypalClient = new paypal.core.PayPalHttpClient(paypalEnvironment);

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { registration_id, amount, currency } = req.body;
    
    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit
      currency: currency || 'USD',
      receipt: `receipt_${registration_id}`
    };

    const order = await razorpay.orders.create(options);

    // Record Payment Intent
    await Payment.create({
      registration_id,
      amount,
      currency: options.currency,
      gateway: 'Razorpay',
      gateway_order_id: order.id,
      status: 'Pending'
    });

    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Create Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await Payment.findOneAndUpdate(
        { gateway_order_id: razorpay_order_id },
        { status: 'Success', gateway_payment_id }
      );

      const payment = await Payment.findOne({ gateway_order_id: razorpay_order_id });
      if (payment && payment.registration_id) {
        const reg = await Registration.findByIdAndUpdate(payment.registration_id, {
          payment_status: 'Paid',
          payment_method: 'Razorpay',
          status: 'Paid'
        }, { new: true });
        
        await emailService.sendReceiptEmail(reg, payment);
      }

      res.status(200).json({ message: 'Payment verified successfully', registration_id: payment ? payment.registration_id : null });
    } else {
      await Payment.findOneAndUpdate(
        { gateway_order_id: razorpay_order_id },
        { status: 'Failed', error_details: 'Signature verification failed' }
      );
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createPaypalOrder = async (req, res) => {
  try {
    const { registration_id, amount, currency } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency || 'USD',
          value: Number(amount).toFixed(2)
        }
      }]
    });

    const order = await paypalClient.execute(request);

    await Payment.create({
      registration_id,
      amount,
      currency: currency || 'USD',
      gateway: 'PayPal',
      gateway_order_id: order.result.id,
      status: 'Pending'
    });

    res.status(200).json(order.result);
  } catch (error) {
    console.error("PayPal Create Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.capturePaypalOrder = async (req, res) => {
  try {
    const { orderID } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await paypalClient.execute(request);

    if (capture.result.status === 'COMPLETED') {
      await Payment.findOneAndUpdate(
        { gateway_order_id: orderID },
        { status: 'Success', gateway_payment_id: capture.result.id }
      );

      const payment = await Payment.findOne({ gateway_order_id: orderID });
      if (payment && payment.registration_id) {
        const reg = await Registration.findByIdAndUpdate(payment.registration_id, {
          payment_status: 'Paid',
          payment_method: 'PayPal',
          status: 'Paid'
        }, { new: true });
        
        await emailService.sendReceiptEmail(reg, payment);
      }

      res.status(200).json({ ...capture.result, registration_id: payment ? payment.registration_id : null });
    } else {
      await Payment.findOneAndUpdate(
        { gateway_order_id: orderID },
        { status: 'Failed', error_details: 'PayPal status not completed' }
      );
      res.status(400).json({ message: 'Payment capture failed' });
    }
  } catch (error) {
    // Check if error contains details from PayPal
    let errorDetails = error.message;
    if (error.statusCode) {
        try {
            errorDetails = JSON.parse(error.message);
        } catch(e) {}
    }
    
    await Payment.findOneAndUpdate(
      { gateway_order_id: req.body.orderID },
      { status: 'Failed', error_details: JSON.stringify(errorDetails) }
    );
    res.status(500).json({ message: error.message });
  }
};

exports.recordFailedPayment = async (req, res) => {
  try {
    const { gateway_order_id, error_details } = req.body;
    
    // First update the main Payment record
    const payment = await Payment.findOneAndUpdate(
      { gateway_order_id },
      { status: 'Failed', error_details: JSON.stringify(error_details) },
      { new: true }
    );
    
    // Then create a dedicated FailedPayment record for the admin dashboard
    if (payment) {
      const FailedPayment = require('../models/failedpayment.model');
      await FailedPayment.create({
        registrationId: payment.registration_id ? payment.registration_id.toString() : 'Unknown',
        amount: payment.amount ? payment.amount.toString() : '0',
        reason: typeof error_details === 'string' ? error_details : JSON.stringify(error_details)
      });
    }

    res.status(200).json({ message: 'Failed payment recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFailedPayments = async (req, res) => {
  try {
    const failedPayments = await Payment.find({ status: 'Failed' }).populate('registration_id').sort({ createdAt: -1 });
    res.status(200).json(failedPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
