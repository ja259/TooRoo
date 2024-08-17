import chai from 'chai';
import sinon from 'sinon';
import { validationResult } from 'express-validator';
import { validateRegister, validateLogin } from '../../../middlewares/Validate.js';

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

    afterEach(() => {
        sinon.restore();
    });

    it('should validate register request', async () => {
        req.body = {
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: [
                { question: 'Question1', answer: 'Answer1' },
                { question: 'Question2', answer: 'Answer2' },
                { question: 'Question3', answer: 'Answer3' },
            ],
        };

        await Promise.all(validateRegister.map(validation => validation(req, res, next)));
        const errors = validationResult(req);
        expect(errors.isEmpty()).to.be.true;
        expect(next.calledOnce).to.be.true;
    });

    it('should return validation error for invalid register request', async () => {
        req.body = {
            username: '',
            email: 'invalidemail',
            phone: '',
            password: 'short',
            securityQuestions: [],
        };

        await Promise.all(validateRegister.map(validation => validation(req, res, next)));
        const errors = validationResult(req);
        expect(errors.isEmpty()).to.be.false;
        expect(res.status.calledWith(400)).to.be.true;
    });

    it('should validate login request', async () => {
        req.body = { emailOrPhone: 'testuser@example.com', password: 'password123' };

        await Promise.all(validateLogin.map(validation => validation(req, res, next)));
        const errors = validationResult(req);
        expect(errors.isEmpty()).to.be.true;
        expect(next.calledOnce).to.be.true;
    });

    it('should return validation error for invalid login request', async () => {
        req.body = { emailOrPhone: '', password: '' };

        await Promise.all(validateLogin.map(validation => validation(req, res, next)));
        const errors = validationResult(req);
        expect(errors.isEmpty()).to.be.false;
        expect(res.status.calledWith(400)).to.be.true;
    });
});
