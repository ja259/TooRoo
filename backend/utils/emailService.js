import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const { EMAIL, EMAIL_PASSWORD, EMAIL_SERVICE } = process.env;

if (!EMAIL || !EMAIL_PASSWORD) {
    throw new Error('Email configuration environment variables (EMAIL, EMAIL_PASSWORD) are not defined');
}

const emailService = {
    sendEmail: async (email, subject, message) => {
        try {
            const transporter = nodemailer.createTransport({
                service: EMAIL_SERVICE || 'Gmail',
                auth: {
                    user: EMAIL,
                    pass: EMAIL_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            const mailOptions = {
                from: 'TooRoo Support <no-reply@tooroo.app>',
                to: email,
                subject: subject,
                text: message,
                html: `<p>${message}</p>`,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${email} with subject "${subject}"`);
        } catch (err) {
            console.error('Failed to send email:', err);
            throw new Error('Failed to send email');
        }
    },
};

export default emailService;
