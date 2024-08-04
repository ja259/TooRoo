import * as chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import nodemailer from 'nodemailer';
import { sendEmail } from '../../../utils/emailService.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Email Service Tests', () => {
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
        try {
            const result = await sendEmail('test@example.com', 'Test Email', 'This is a test email');
            expect(result.response).to.equal('Email sent successfully');
        } catch (error) {
            throw new Error('Test failed');
        }
    });

    it('should handle errors during email sending', async () => {
        try {
            await sendEmail('', 'Test Email', 'This is a test email');
        } catch (error) {
            expect(error).to.exist;
            expect(error.message).to.equal('Failed to send email');
        }
    });
});
