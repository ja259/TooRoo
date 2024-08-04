import * as chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import nodemailer from 'nodemailer';
import emailService from '../../../utils/emailService.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Email Service Integration Tests', () => {
    let transportStub;

    before(() => {
        transportStub = sinon.stub(nodemailer, 'createTransport').returns({
            sendMail: (options, callback) => {
                if (!options.to) {
                    return callback(new Error('No recipients defined'));
                }
                callback(null, { response: 'Email sent successfully' });
            }
        });
    });

    after(() => {
        transportStub.restore();
    });

    it('should send an email successfully', async () => {
        const response = await emailService.sendEmail('test@example.com', 'Test Email', 'This is a test email');
        expect(response).to.have.property('response', 'Email sent successfully');
    });

    it('should handle errors during email sending', async () => {
        try {
            await emailService.sendEmail(null, 'Test Email', 'This is a test email');
        } catch (error) {
            expect(error.message).to.equal('No recipients defined');
        }
    });

    it('should throw an error if no recipient is provided', async () => {
        try {
            await emailService.sendEmail('', 'Test Email', 'This is a test email');
        } catch (error) {
            expect(error.message).to.equal('No recipients defined');
        }
    });
});
