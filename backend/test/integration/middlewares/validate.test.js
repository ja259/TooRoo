import * as chai from 'chai';
import { validateRegister, validateLogin } from '../../../middlewares/validate.js';
import { validationResult } from 'express-validator';

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

    afterEach(() => {
        sinon.restore();
    });

    it('should validate register request', async () => {
        req.body = {
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: ['Question1', 'Question2', 'Question3']
        };

        await Promise.all(validateRegister.map(validation => validation.run(req)));
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
        } else {
            next();
        }

        expect(next.calledOnce).to.be.true;
    });

    it('should return validation error for invalid register request', async () => {
        req.body = { username: '', email: 'invalidemail', phone: '', password: 'short', securityQuestions: [] };

        await Promise.all(validateRegister.map(validation => validation.run(req)));
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
        } else {
            next();
        }

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('errors'))).to.be.true;
    });

    it('should validate login request', async () => {
        req.body = { emailOrPhone: 'testuser@example.com', password: 'password123' };

        await Promise.all(validateLogin.map(validation => validation.run(req)));
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
        } else {
            next();
        }

        expect(next.calledOnce).to.be.true;
    });

    it('should return validation error for invalid login request', async () => {
        req.body = { emailOrPhone: '', password: '' };

        await Promise.all(validateLogin.map(validation => validation.run(req)));
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
        } else {
            next();
        }

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('errors'))).to.be.true;
    });
});
