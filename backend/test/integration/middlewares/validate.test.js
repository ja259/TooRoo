import * as chai from 'chai';
import sinon from 'sinon';
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../../../middlewares/validate.js';

const { expect } = chai;

describe('Validation Middleware Tests', () => {
    const mockReq = (body) => ({
        body,
    });

    const mockRes = () => {
        const res = {};
        res.status = sinon.stub().returns(res);
        res.json = sinon.stub().returns(res);
        return res;
    };

    const next = sinon.spy();

    it('should validate register request', (done) => {
        const req = mockReq({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            phone: '1234567890',
            securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
        });
        const res = mockRes();

        validateRegister(req, res, next);

        expect(next.calledOnce).to.be.true;
        done();
    });

    it('should return validation error for invalid register request', (done) => {
        const req = mockReq({
            username: '',
            email: 'invalidemail',
            password: 'short',
            phone: '',
            securityQuestions: [{ question: '', answer: '' }]
        });
        const res = mockRes();

        validateRegister(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ message: sinon.match.string })).to.be.true;
        done();
    });

    it('should validate login request', (done) => {
        const req = mockReq({
            emailOrPhone: 'testuser@example.com',
            password: 'password123'
        });
        const res = mockRes();

        validateLogin(req, res, next);

        expect(next.calledOnce).to.be.true;
        done();
    });

    it('should return validation error for invalid login request', (done) => {
        const req = mockReq({
            emailOrPhone: '',
            password: ''
        });
        const res = mockRes();

        validateLogin(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ message: sinon.match.string })).to.be.true;
        done();
    });

    it('should validate forgot password request', (done) => {
        const req = mockReq({
            email: 'testuser@example.com'
        });
        const res = mockRes();

        validateForgotPassword(req, res, next);

        expect(next.calledOnce).to.be.true;
        done();
    });

    it('should return validation error for invalid forgot password request', (done) => {
        const req = mockReq({
            email: ''
        });
        const res = mockRes();

        validateForgotPassword(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ message: sinon.match.string })).to.be.true;
        done();
    });

    it('should validate reset password request', (done) => {
        const req = mockReq({
            token: 'validtoken',
            newPassword: 'newpassword123',
            securityAnswers: ['a1', 'a2', 'a3']
        });
        const res = mockRes();

        validateResetPassword(req, res, next);

        expect(next.calledOnce).to.be.true;
        done();
    });

    it('should return validation error for invalid reset password request', (done) => {
        const req = mockReq({
            token: '',
            newPassword: '',
            securityAnswers: ['', '', '']
        });
        const res = mockRes();

        validateResetPassword(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ message: sinon.match.string })).to.be.true;
        done();
    });
});
