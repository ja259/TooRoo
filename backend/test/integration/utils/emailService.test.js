import * as chai from 'chai';
import sinon from 'sinon';
import nodemailer from 'nodemailer';
import { sendEmail } from '../../../utils/emailService.js';

const { expect } = chai;

describe('Email Service Tests', () => {
    let transporter;

    beforeEach(() => {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        sinon.stub(nodemailer, 'createTransport').returns(transporter);
    });

    afterEach(() => {
        nodemailer.createTransport.restore();
    });

    it('should send an email', async () => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'test@example.com',
            subject: 'Test Email',
            text: 'This is a test email'
        };
        const result = await sendEmail(mailOptions);
        expect(result).to.have.property('accepted');
        expect(result.accepted).to.include('test@example.com');
    });
});
