import * as chai from 'chai';
import { validationResult } from 'express-validator';
import { validateRegister, validateLogin } from '../../../middlewares/validate.js';

const { expect } = chai;

describe('Validation Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: (statusCode) => ({
                json: (body) => ({
                    status: statusCode,
                    body,
                }),
            }),
        };
        next = () => true;
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

        await Promise.all(validateRegister.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
        expect(next()).to.be.true;
    });

    it('should return validation error for invalid register request', async () => {
        req.body = {
            username: '',
            email: 'invalidemail',
            phone: '',
            password: 'short',
            securityQuestions: [],
        };

        await Promise.all(validateRegister.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const response = res.status(400).json({ errors: errors.array() });
            expect(response.status).to.equal(400);
            expect(response.body.errors).to.be.an('array').that.is.not.empty;
        }
    });

    it('should validate login request', async () => {
        req.body = { emailOrPhone: 'testuser@example.com', password: 'password123' };

        await Promise.all(validateLogin.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
        expect(next()).to.be.true;
    });

    it('should return validation error for invalid login request', async () => {
        req.body = { emailOrPhone: '', password: '' };

        await Promise.all(validateLogin.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const response = res.status(400).json({ errors: errors.array() });
            expect(response.status).to.equal(400);
            expect(response.body.errors).to.be.an('array').that.is.not.empty;
        }
    });
});
