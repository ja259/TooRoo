import * as chai from 'chai';
import sinon from 'sinon';
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../../../middlewares/validate.js';

const { expect } = chai;

describe('Validation Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
        next = sinon.stub();
    });

    describe('validateRegister', () => {
        it('should validate register request', () => {
            req.body = {
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'What is your pet’s name?', answer: 'Fluffy' },
                    { question: 'What is your mother’s maiden name?', answer: 'Smith' },
                    { question: 'What is your favorite color?', answer: 'Blue' }
                ]
            };

            validateRegister(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('should return validation error for invalid register request', () => {
            req.body = {
                email: 'testuser@example.com'
            };

            validateRegister(req, res, next);

            expect(res.status.calledWith(422)).to.be.true;
            expect(res.json.calledWith({
                errors: [
                    { param: 'username', msg: 'Username is required' },
                    { param: 'phone', msg: 'Phone number is required' },
                    { param: 'password', msg: 'Password is required' },
                    { param: 'securityQuestions', msg: 'Security questions are required' }
                ]
            })).to.be.true;
        });
    });

    describe('validateLogin', () => {
        it('should validate login request', () => {
            req.body = {
                emailOrPhone: 'testuser@example.com',
                password: 'password123'
            };

            validateLogin(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('should return validation error for invalid login request', () => {
            req.body = {};

            validateLogin(req, res, next);

            expect(res.status.calledWith(422)).to.be.true;
            expect(res.json.calledWith({
                errors: [
                    { param: 'emailOrPhone', msg: 'Email or phone number is required' },
                    { param: 'password', msg: 'Password is required' }
                ]
            })).to.be.true;
        });
    });

    describe('validateForgotPassword', () => {
        it('should validate forgot password request', () => {
            req.body = {
                email: 'testuser@example.com'
            };

            validateForgotPassword(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('should return validation error for invalid forgot password request', () => {
            req.body = {};

            validateForgotPassword(req, res, next);

            expect(res.status.calledWith(422)).to.be.true;
            expect(res.json.calledWith({
                errors: [
                    { param: 'email', msg: 'Email is required' }
                ]
            })).to.be.true;
        });
    });

    describe('validateResetPassword', () => {
        it('should validate reset password request', () => {
            req.body = {
                token: 'testtoken',
                password: 'newpassword123',
                securityAnswers: ['Fluffy', 'Smith', 'Blue']
            };

            validateResetPassword(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('should return validation error for invalid reset password request', () => {
            req.body = {};

            validateResetPassword(req, res, next);

            expect(res.status.calledWith(422)).to.be.true;
            expect(res.json.calledWith({
                errors: [
                    { param: 'token', msg: 'Token is required' },
                    { param: 'password', msg: 'Password is required' },
                    { param: 'securityAnswers', msg: 'Security answers are required' }
                ]
            })).to.be.true;
        });
    });
});
