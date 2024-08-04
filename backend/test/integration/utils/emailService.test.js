import * as chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import nodemailer from 'nodemailer';
import emailService from '../../../utils/emailService.js'; // Adjust the path as needed

chai.use(chaiHttp);
const { expect } = chai;

describe('Email Service Integration Tests', () => {
    let transportStub;

    before(() => {
        // Stub nodemailer createTransport method
        transportStub = sinon.stub(nodemailer, 'createTransport').returns({
            sendMail: (mailOptions) => {
                if (!mailOptions.to) {
                    throw new Error('No recipients defined');
                }
                return { response: 'Email sent successfully' };
            }
        });
    });

    after(() => {
        // Restore the original method
        transportStub.restore();
    });

    it('should send an email successfully', async () => {
        try {
            const result = await emailService.sendEmail('test@example.com', 'Test Email', 'This is a test email');
            expect(result.response).to.equal('Email sent successfully');
        } catch (error) {
            throw new Error('Test failed');
        }
    });

    it('should handle errors during email sending', async () => {
        try {
            await emailService.sendEmail('', 'Test Email', 'This is a test email');
        } catch (error) {
            expect(error).to.exist;
            expect(error.message).to.equal('Failed to send email');
        }
    });

    it('should throw an error if no recipient is provided', async () => {
        try {
            await emailService.sendEmail('', 'Test Email', 'This is a test email');
        } catch (error) {
            expect(error).to.exist;
            expect(error.message).to.equal('No recipients defined');
        }
    });
});
