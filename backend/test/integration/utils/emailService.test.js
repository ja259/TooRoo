import chai from 'chai';
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
                callback(null, 'Email sent successfully');
            }
        });
    });

    after(() => {
        transportStub.restore();
    });

    it('should send an email successfully', (done) => {
        sendEmail({
            to: 'test@example.com',
            subject: 'Test Email',
            text: 'This is a test email'
        }, (error, info) => {
            expect(info).to.equal('Email sent successfully');
            done();
        });
    });

    it('should handle errors during email sending', (done) => {
        sendEmail({
            subject: 'Test Email',
            text: 'This is a test email'
        }, (error, info) => {
            expect(error).to.exist;
            expect(error.message).to.equal('No recipients defined');
            done();
        });
    });
});
