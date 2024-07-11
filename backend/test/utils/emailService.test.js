import * as chai from 'chai';
import sinon from 'sinon';
import nodemailer from 'nodemailer';
import emailService from '../../utils/emailService.js';

chai.should();

describe('Email Service Tests', () => {
    let transporter;

    beforeEach(() => {
        transporter = { sendMail: sinon.stub().resolves() };
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
            text: 'Test Message',
            html: '<p>Test Message</p>'
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

    it('should use the correct email service and credentials', async () => {
        await emailService.sendEmail('test@example.com', 'Test Subject', 'Test Message');
        nodemailer.createTransport.calledOnce.should.be.true;
        nodemailer.createTransport.calledWithMatch({
            service: process.env.EMAIL_SERVICE || 'Gmail',
            auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
            tls: { rejectUnauthorized: false }
        }).should.be.true;
    });

    it('should log the email sending process', async () => {
        const consoleSpy = sinon.spy(console, 'log');
        await emailService.sendEmail('test@example.com', 'Test Subject', 'Test Message');
        consoleSpy.calledWith(`Email sent to test@example.com with subject "Test Subject"`).should.be.true;
        consoleSpy.restore();
    });

    it('should handle missing environment variables', () => {
        const originalEmail = process.env.EMAIL;
        const originalEmailPassword = process.env.EMAIL_PASSWORD;
        delete process.env.EMAIL;
        delete process.env.EMAIL_PASSWORD;

        (() => {
            import('../utils/emailService.js');
        }).should.throw('Email configuration environment variables (EMAIL, EMAIL_PASSWORD) are not defined');

        process.env.EMAIL = originalEmail;
        process.env.EMAIL_PASSWORD = originalEmailPassword;
    });
});
