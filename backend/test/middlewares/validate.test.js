import * as chai from 'chai';
import sinon from 'sinon';
import {
    validateRegister,
    validateLogin,
    validateResetPassword,
    validateForgotPassword
} from '../../middlewares/validate.js';

chai.should();

describe('Validation Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: sinon.stub().returns({ json: sinon.stub() })
        };
        next = sinon.stub();
    });

    it('should validate register request', () => {
        req.body = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            securityQuestions: [
                { question: 'Question1', answer: 'Answer1' },
                { question: 'Question2', answer: 'Answer2' },
                { question: 'Question3', answer: 'Answer3' }
            ]
        };
        validateRegister[validateRegister.length - 1](req, res, next);
        next.calledOnce.should.be.true;
    });

    it('should return validation error for invalid register request', () => {
        req.body = {
            email: 'invalidemail',
            password: 'short',
            securityQuestions: ['Question 1']
        };
        validateRegister[validateRegister.length - 1](req, res, next);
        res.status.calledWith(400).should.be.true;
    });

    it('should validate login request', () => {
        req.body = {
            emailOrPhone: 'testuser@example.com',
            password: 'password123'
        };
        validateLogin[validateLogin.length - 1](req, res, next);
        next.calledOnce.should.be.true;
    });

    it('should return validation error for invalid login request', () => {
        req.body = {
            emailOrPhone: 'invalidemail'
        };
        validateLogin[validateLogin.length - 1](req, res, next);
        res.status.calledWith(400).should.be.true;
    });

    it('should validate reset password request', () => {
        req.body = {
            password: 'newpassword123',
            confirmPassword: 'newpassword123',
            securityAnswers: ['Answer1', 'Answer2', 'Answer3']
        };
        validateResetPassword[validateResetPassword.length - 1](req, res, next);
        next.calledOnce.should.be.true;
    });

    it('should return validation error for invalid reset password request', () => {
        req.body = {
            password: 'short',
            confirmPassword: 'short',
            securityAnswers: ['Wrong1']
        };
        validateResetPassword[validateResetPassword.length - 1](req, res, next);
        res.status.calledWith(400).should.be.true;
    });

    it('should validate forgot password request', () => {
        req.body = {
            email: 'testuser@example.com'
        };
        validateForgotPassword[validateForgotPassword.length - 1](req, res, next);
        next.calledOnce.should.be.true;
    });

    it('should return validation error for invalid forgot password request', () => {
        req.body = {
            email: 'invalidemail'
        };
        validateForgotPassword[validateForgotPassword.length - 1](req, res, next);
        res.status.calledWith(400).should.be.true;
    });
});
