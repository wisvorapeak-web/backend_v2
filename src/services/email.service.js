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

exports.sendCustomPaymentLinkEmail = async (email, linkData, publicLinkUrl) => {
  if (!process.env.SMTP_USER) {
    console.warn("SMTP_USER not configured, skipping payment link email.");
    return;
  }

  const currencySymbol = linkData.currency === 'INR' ? '₹' : '$';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #2CC8E5; text-align: center;">Payment Request</h2>
      <p>Hello,</p>
      <p>A new payment request has been generated for you.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Description:</strong> ${linkData.title}</p>
        <p><strong>Amount Due:</strong> ${currencySymbol}${linkData.amount}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${publicLinkUrl}" style="background-color: #2CC8E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Pay Now</a>
      </div>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p><a href="${publicLinkUrl}">${publicLinkUrl}</a></p>
      <p>Best Regards,<br/>${process.env.SMTP_FROM_NAME || 'The Team'}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'The Team'}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Payment Request: ${linkData.title}`,
      html: html,
    });
    console.log(`Payment link email sent to ${email}`);
  } catch (error) {
    console.error("Error sending payment link email:", error);
  }
};
