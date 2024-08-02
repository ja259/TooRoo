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
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    describe('validateRegister', () => {
        it('should validate register request', () => {
            req.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };

            validateRegister(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('should return validation error for invalid register request', () => {
            req.body = { name: 'Test User', email: 'invalidEmail', password: 'short' };

            validateRegister(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Invalid request data' })).to.be.true;
        });
    });

    describe('validateLogin', () => {
        it('should validate login request', () => {
            req.body = { email: 'test@example.com', password: 'password123' };

            validateLogin(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('should return validation error for invalid login request', () => {
            req.body = { email: 'invalidEmail', password: 'short' };

            validateLogin(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Invalid request data' })).to.be.true;
        });
    });

    describe('validateForgotPassword', () => {
        it('should validate forgot password request', () => {
            req.body = { email: 'test@example.com' };

            validateForgotPassword(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('should return validation error for invalid forgot password request', () => {
            req.body = { email: 'invalidEmail' };

            validateForgotPassword(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Invalid request data' })).to.be.true;
        });
    });

    describe('validateResetPassword', () => {
        it('should validate reset password request', () => {
            req.body = { password: 'newpassword123' };

            validateResetPassword(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('should return validation error for invalid reset password request', () => {
            req.body = { password: 'short' };

            validateResetPassword(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Invalid request data' })).to.be.true;
        });
    });
});
