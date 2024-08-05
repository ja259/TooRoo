import * as chai from 'chai';
import { sendEmail } from '../../../utils/emailService.js';

const { expect } = chai;

describe('Email Service Integration Tests', () => {
    it('should send an email successfully', async () => {
        const result = await sendEmail('test@example.com', 'Test Subject', 'Test Body');
        expect(result.response).to.equal('Email sent successfully');
    });

    it('should handle errors during email sending', async () => {
        try {
            await sendEmail(null, 'Test Subject', 'Test Body');
        } catch (error) {
            expect(error.message).to.equal('Failed to send email');
        }
    });

    it('should throw an error if no recipient is provided', async () => {
        try {
            await sendEmail('', 'Test Subject', 'Test Body');
        } catch (error) {
            expect(error.message).to.equal('Failed to send email');
        }
    });
});
