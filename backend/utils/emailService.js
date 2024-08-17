import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transporter = nodemailer.createTransport({
    service: config.emailService,
    auth: {
        user: config.email,
        pass: config.emailPassword
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: config.email,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return { response: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);

        if (error.response && error.response.includes('No recipients defined')) {
            throw new Error('No recipients defined');
        } else if (error.response && error.response.includes('Invalid email address')) {
            throw new Error('Invalid email address');
        } else {
            throw new Error('Failed to send email');
        }
    }
};

export { sendEmail };
export default { sendEmail };
