import chai from 'chai';
import sinon from 'sinon';
import { validationResult } from 'express-validator';
import { validateRegister, validateLogin, validateResetPassword, validateForgotPassword } from '../../middlewares/validate.js';

const should = chai.should();

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
});
