const { Client, Environment, LogLevel } = require('@paypal/paypal-server-sdk');

// Initialize PayPal client
let paypalClient = null;

try {
  if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
    const environment = process.env.NODE_ENV === 'production' 
      ? new Environment.ProductionEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
      : new Environment.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
      
    paypalClient = new Client({
      environment,
      logging: {
        logLevel: LogLevel.Info,
      }
    });
    console.log('PayPal configured');
  } else {
    console.warn('PayPal keys not found in environment variables');
  }
} catch (error) {
  console.error('Error configuring PayPal:', error.message);
}

module.exports = paypalClient;
