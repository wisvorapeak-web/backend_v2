const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendReceiptEmail = async (registration, payment) => {
  if (!process.env.SMTP_USER) {
    console.warn("SMTP_USER not configured, skipping receipt email.");
    return;
  }

  const receiptHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #2CC8E5; text-align: center;">Payment Receipt</h2>
      <p>Hi ${registration.name},</p>
      <p>Thank you for your payment. Your transaction was successful.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${payment.gateway_order_id}</p>
        <p><strong>Package:</strong> ${registration.package_name}</p>
        <p><strong>Amount Paid:</strong> ${payment.currency} ${payment.amount}</p>
        <p><strong>Payment Method:</strong> ${payment.gateway}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <p>You can download a copy of your receipt from the success page.</p>
      <p>Best Regards,<br/>${process.env.SMTP_FROM_NAME || 'The Team'}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'The Team'}" <${process.env.SMTP_USER}>`,
      to: registration.email,
      subject: `Payment Receipt - Order ${payment.gateway_order_id}`,
      html: receiptHtml,
    });
    console.log(`Receipt email sent to ${registration.email}`);
  } catch (error) {
    console.error("Error sending receipt email:", error);
  }
};
