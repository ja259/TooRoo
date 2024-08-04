// test/integration/utils/emailService.test.js
import chai from 'chai';
import chaiHttp from 'chai-http';
import emailService from '../../../utils/emailService.js';
import dotenv from 'dotenv';

chai.use(chaiHttp);
const { expect } = chai;

// Load environment variables from .env file
dotenv.config();

describe('Email Service Integration Tests', () => {
    it('should send an email successfully', async () => {
        const result = await emailService.sendEmail({
            to: process.env.TEST_EMAIL_RECIPIENT,
            subject: 'Test Email',
            text: 'This is a test email'
        });
        expect(result).to.have.property('accepted').that.includes(process.env.TEST_EMAIL_RECIPIENT);
    });

    it('should handle errors during email sending', async () => {
        try {
            await emailService.sendEmail({
                to: '',
                subject: 'Test Email',
                text: 'This is a test email'
            });
        } catch (error) {
            expect(error.message).to.equal('No recipients defined');
        }
    });

    it('should throw an error if no recipient is provided', async () => {
        try {
            await emailService.sendEmail({
                subject: 'Test Email',
                text: 'This is a test email'
            });
        } catch (error) {
            expect(error.message).to.equal('No recipients defined');
        }
    });
});
