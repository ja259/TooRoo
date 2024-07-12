import * as chai from 'chai';
import sinon from 'sinon';
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../../../middlewares/validate.js';

const { should } = chai;
should();

// Validation Middleware Test
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
            phone: '1234567890',
            password: 'password123',
            securityQuestions: ['Question 1', 'Question 2', 'Question 3']
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

    it('should validate forgot password request', () => {
        req.body = {
            email: 'testuser@example.com',
            securityAnswers: ['Answer1', 'Answer2', 'Answer3']
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

    it('should validate reset password request', () => {
        req.body = {
            password: 'newpassword123',
            securityAnswers: ['Answer1', 'Answer2', 'Answer3']
        };
        validateResetPassword[validateResetPassword.length - 1](req, res, next);
        next.calledOnce.should.be.true;
    });

    it('should return validation error for invalid reset password request', () => {
        req.body = {
            password: 'short',
            securityAnswers: ['Wrong1', 'Wrong2', 'Wrong3']
        };
        validateResetPassword[validateResetPassword.length - 1](req, res, next);
        res.status.calledWith(400).should.be.true;
    });
});
