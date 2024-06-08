const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    const mailOptions = {
      from: 'TooRoo Support <no-reply@tooroo.app>',
      to: email,
      subject: subject,
      text: message
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Failed to send email:', err);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
