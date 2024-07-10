import * as chai from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as authController from '../../controllers/authController.js';
import User from '../../models/User.js';
import emailService from '../../utils/emailService.js';

const { expect } = chai;

describe('Auth Controller', () => {
    describe('register', () => {
        it('should register a new user', async () => {
            const req = {
                body: {
                    username: 'testuser',
                    email: 'testuser@example.com',
                    phone: '1234567890',
                    password: 'password123',
                    securityQuestions: [{ question: 'Q1', answer: 'A1' }, { question: 'Q2', answer: 'A2' }, { question: 'Q3', answer: 'A3' }]
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(User, 'findOne').resolves(null);
            sinon.stub(bcrypt, 'hash').resolves('hashedpassword');
            sinon.stub(User.prototype, 'save').resolves({
                _id: 'testUserId'
            });
            sinon.stub(jwt, 'sign').returns('testToken');

            await authController.register(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({ message: 'User registered successfully', token: 'testToken', userId: 'testUserId' })).to.be.true;

            User.findOne.restore();
            bcrypt.hash.restore();
            User.prototype.save.restore();
            jwt.sign.restore();
        });

        it('should return 409 if user already exists', async () => {
            const req = {
                body: {
                    username: 'testuser',
                    email: 'testuser@example.com',
                    phone: '1234567890',
                    password: 'password123',
                    securityQuestions: [{ question: 'Q1', answer: 'A1' }, { question: 'Q2', answer: 'A2' }, { question: 'Q3', answer: 'A3' }]
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(User, 'findOne').resolves({});

            await authController.register(req, res);

            expect(res.status.calledWith(409)).to.be.true;
            expect(res.json.calledWith({ message: 'Email or phone already registered' })).to.be.true;

            User.findOne.restore();
        });
    });

    describe('login', () => {
        it('should login user with correct credentials', async () => {
            const req = {
                body: {
                    emailOrPhone: 'testuser@example.com',
                    password: 'password123'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(User, 'findOne').resolves({
                _id: 'testUserId',
                password: 'hashedpassword',
                select: function() { return this; }
            });
            sinon.stub(bcrypt, 'compare').resolves(true);
            sinon.stub(jwt, 'sign').returns('testToken');

            await authController.login(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Logged in successfully', token: 'testToken', userId: 'testUserId' })).to.be.true;

            User.findOne.restore();
            bcrypt.compare.restore();
            jwt.sign.restore();
        });

        it('should return 401 if credentials are invalid', async () => {
            const req = {
                body: {
                    emailOrPhone: 'testuser@example.com',
                    password: 'wrongpassword'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };

            sinon.stub(User, 'findOne').resolves({
                password: 'hashedpassword',
                select: function() { return this; }
            });
            sinon.stub(bcrypt, 'compare').resolves(false);

            await authController.login(req, res);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'Invalid credentials' })).to.be.true;

            User.findOne.restore();
            bcrypt.compare.restore();
        });
    });

    describe('forgotPassword', () => {
        it('should send a password reset token', async () => {
            const req = { body: { email: 'testuser@example.com' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(User, 'findOne').resolves({ email: 'testuser@example.com', save: sinon.stub() });
            sinon.stub(crypto, 'randomBytes').callsFake((size, callback) => callback(null, Buffer.from('randomtoken')));
            sinon.stub(emailService, 'sendEmail').resolves();

            await authController.forgotPassword(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Password reset token sent', token: 'randomtoken' })).to.be.true;

            User.findOne.restore();
            crypto.randomBytes.restore();
            emailService.sendEmail.restore();
        });
    });

    describe('resetPassword', () => {
        it('should reset the password', async () => {
            const req = {
                body: {
                    token: 'randomtoken',
                    password: 'newpassword123',
                    securityAnswers: ['A1', 'A2', 'A3']
                }
            };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(User, 'findOne').resolves({
                securityQuestions: [{ answer: 'A1' }, { answer: 'A2' }, { answer: 'A3' }],
                save: sinon.stub()
            });
            sinon.stub(bcrypt, 'hash').resolves('hashedpassword');

            await authController.resetPassword(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Password has been reset successfully' })).to.be.true;

            User.findOne.restore();
            bcrypt.hash.restore();
        });
    });
});
