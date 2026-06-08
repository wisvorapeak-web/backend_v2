const nodemailer = require('nodemailer');

// Global progress tracker
const emailSendingProgress = {
  isActive: false,
  total: 0,
  sent: 0,
  failed: 0,
  startTime: null,
  lastUpdated: null,
};

exports.getProgress = () => emailSendingProgress;

exports.sendBulkEmails = async (req, res) => {
  try {
    const { senderName, senderEmail, subject, message, recipients } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ message: 'No valid recipients provided' });
    }

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    // Configure Nodemailer for Hostinger
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let sentCount = 0;
    const errors = [];

    // Reset progress tracker
    emailSendingProgress.isActive = true;
    emailSendingProgress.total = recipients.length;
    emailSendingProgress.sent = 0;
    emailSendingProgress.failed = 0;
    emailSendingProgress.startTime = new Date().toISOString();
    emailSendingProgress.lastUpdated = new Date().toISOString();

    // Send emails
    for (const recipient of recipients) {
      if (!recipient.email) continue;

      const personalizedMessage = message.replace(/\{\{name\}\}/g, recipient.name || 'Delegate');

      const mailOptions = {
        from: `"${senderName}" <${process.env.SMTP_USER || senderEmail}>`, // Hostinger may require from email to match SMTP user
        to: recipient.email,
        subject: subject,
        text: personalizedMessage,
      };

      try {
        await transporter.sendMail(mailOptions);
        sentCount++;
        emailSendingProgress.sent = sentCount;
      } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error);
        errors.push({ email: recipient.email, error: error.message });
        emailSendingProgress.failed = errors.length;
      }
      emailSendingProgress.lastUpdated = new Date().toISOString();
    }

    emailSendingProgress.isActive = false;

    res.status(200).json({
      success: true,
      message: 'Bulk email dispatch completed',
      sentCount,
      total: recipients.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error in sendBulkEmails:', error);
    emailSendingProgress.isActive = false;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
