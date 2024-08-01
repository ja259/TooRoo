import * as chai from 'chai';
import sinon from 'sinon';
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../../../middlewares/validate.js';
import { validationResult } from 'express-validator';

chai.should();

describe('Validation Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = { status: sinon.stub().returns({ json: sinon.stub() }) };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('validateRegister', () => {
        it('should validate register request', () => {
            req.body = {
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: ['Question 1', 'Question 2', 'Question 3']
            };
            sinon.stub(validationResult(req), 'isEmpty').returns(true);

            validateRegister[validateRegister.length - 1](req, res, next);
            next.calledOnce.should.be.true;
        });

        it('should return validation error for invalid register request', () => {
            req.body = { email: 'invalidemail', password: 'short', securityQuestions: ['Question 1'] };
            sinon.stub(validationResult(req), 'isEmpty').returns(false);
            sinon.stub(validationResult(req), 'array').returns([{ msg: 'Validation error' }]);

            validateRegister[validateRegister.length - 1](req, res, next);
            res.status.calledWith(400).should.be.true;
        });
    });

    describe('validateLogin', () => {
        it('should validate login request', () => {
            req.body = { emailOrPhone: 'testuser@example.com', password: 'password123' };
            sinon.stub(validationResult(req), 'isEmpty').returns(true);

            validateLogin[validateLogin.length - 1](req, res, next);
            next.calledOnce.should.be.true;
        });

        it('should return validation error for invalid login request', () => {
            req.body = { emailOrPhone: 'invalidemail' };
            sinon.stub(validationResult(req), 'isEmpty').returns(false);
            sinon.stub(validationResult(req), 'array').returns([{ msg: 'Validation error' }]);

            validateLogin[validateLogin.length - 1](req, res, next);
            res.status.calledWith(400).should.be.true;
        });
    });

    describe('validateForgotPassword', () => {
        it('should validate forgot password request', () => {
            req.body = { email: 'testuser@example.com', securityAnswers: ['Answer1', 'Answer2', 'Answer3'] };
            sinon.stub(validationResult(req), 'isEmpty').returns(true);

            validateForgotPassword[validateForgotPassword.length - 1](req, res, next);
            next.calledOnce.should.be.true;
        });

        it('should return validation error for invalid forgot password request', () => {
            req.body = { email: 'invalidemail' };
            sinon.stub(validationResult(req), 'isEmpty').returns(false);
            sinon.stub(validationResult(req), 'array').returns([{ msg: 'Validation error' }]);

            validateForgotPassword[validateForgotPassword.length - 1](req, res, next);
            res.status.calledWith(400).should.be.true;
        });
    });

    describe('validateResetPassword', () => {
        it('should validate reset password request', () => {
            req.body = { password: 'newpassword123', securityAnswers: ['Answer1', 'Answer2', 'Answer3'] };
            sinon.stub(validationResult(req), 'isEmpty').returns.true;

            validateResetPassword[validateResetPassword.length - 1](req, res, next);
            next.calledOnce.should.be.true;
        });

        it('should return validation error for invalid reset password request', () => {
            req.body = { password: 'short', securityAnswers: ['Wrong1', 'Wrong2', 'Wrong3'] };
            sinon.stub(validationResult(req), 'isEmpty').returns(false);
            sinon.stub(validationResult(req), 'array').returns([{ msg: 'Validation error' }]);

            validateResetPassword[validateResetPassword.length - 1](req, res, next);
            res.status.calledWith(400).should.be.true;
        });
    });
});
