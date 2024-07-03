import chai from 'chai';
import sinon from 'sinon';
import nodemailer from 'nodemailer';
import emailService from '../../utils/emailService.js';

const should = chai.should();

describe('Email Service Tests', () => {
    let transporter;

    beforeEach(() => {
        transporter = {
            sendMail: sinon.stub().resolves()
        };
        sinon.stub(nodemailer, 'createTransport').returns(transporter);
    });

    afterEach(() => {
        nodemailer.createTransport.restore();
    });

    it('should send an email', async () => {
        await emailService.sendEmail('test@example.com', 'Test Subject', 'Test Message');
        transporter.sendMail.calledOnce.should.be.true;
        transporter.sendMail.calledWithMatch({
            to: 'test@example.com',
            subject: 'Test Subject',
            text: 'Test Message'
        }).should.be.true;
    });

    it('should throw an error if email sending fails', async () => {
        transporter.sendMail.rejects(new Error('Failed to send email'));
        try {
            await emailService.sendEmail('test@example.com', 'Test Subject', 'Test Message');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.equal('Failed to send email');
        }
    });
});
