const nodemailer = require('nodemailer');

const emailService = {
  sendEmail: async (email, subject, message) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: 'TooRoo Support <no-reply@tooroo.app>',
        to: email,
        subject: subject,
        text: message,
        html: `<p>${message}</p>`
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${email} with subject "${subject}"`);
    } catch (err) {
      console.error('Failed to send email:', err);
      throw new Error('Failed to send email');
    }
  }
};

module.exports = emailService;


