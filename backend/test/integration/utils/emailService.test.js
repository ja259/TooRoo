import { expect } from 'chai';
import emailService from '../../../utils/emailService.js';

describe('Email Service Tests', () => {
    it('should send an email successfully', async () => {
        const result = await emailService.sendEmail('test@example.com', 'Test Subject', 'Test Message');
        expect(result).to.exist;
    });

    it('should handle errors during email sending', async () => {
        try {
            await emailService.sendEmail(null, 'Test Subject', 'Test Message');
        } catch (error) {
            expect(error).to.exist;
        }
    });
});
