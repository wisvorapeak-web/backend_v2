require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendTestEmail() {
  console.log("Setting up transporter...");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true' || true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_USER}>`,
    to: 'basumgarianand109@gmail.com',
    subject: 'Test Email from Ascendix Summit',
    text: 'Hello! This is a test email from the bulk email dispatch system to confirm your SMTP configuration is working correctly.',
  };

  try {
    console.log("Sending email to basumgarianand109@gmail.com...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

sendTestEmail();
