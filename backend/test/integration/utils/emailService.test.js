import * as chai from 'chai';
import sinon from 'sinon';
import nodemailer from 'nodemailer';
import emailService from '../../../services/emailService.js';

const { expect } = chai;

describe('Email Service Tests', () => {
    let sendMailStub;

    beforeEach(() => {
        sendMailStub = sinon.stub(nodemailer.createTransport(), 'sendMail').callsFake((mailOptions, callback) => {
            callback(null, { response: '250 OK' });
        });
    });

    afterEach(() => {
        sendMailStub.restore();
    });

    it('should send an email', async () => {
        const result = await emailService.sendEmail('test@example.com', 'Test Subject', 'Test Text');
        expect(result).to.have.property('response', '250 OK');
    });

    it('should throw an error when email fails to send', async () => {
        sendMailStub.callsFake((mailOptions, callback) => {
            callback(new Error('Email send failed'), null);
        });

        try {
            await emailService.sendEmail('test@example.com', 'Test Subject', 'Test Text');
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.equal('Email send failed');
        }
    });
});
