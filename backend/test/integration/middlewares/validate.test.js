import * as chai from 'chai';
import sinon from 'sinon';
import '../../setup.js';
import '../../teardown.js';
import * as validate from '../../../middlewares/validate.js';

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

    it('should validate register request', () => {
        req.body = {
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: ['Question1', 'Question2', 'Question3']
        };

        validate.validateRegister(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    it('should return validation error for invalid register request', () => {
        req.body = { username: '', email: 'invalidemail', phone: '', password: 'short', securityQuestions: [] };

        validate.validateRegister(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('errors'))).to.be.true;
    });

    it('should validate login request', () => {
        req.body = { emailOrPhone: 'testuser@example.com', password: 'password123' };

        validate.validateLogin(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    it('should return validation error for invalid login request', () => {
        req.body = { emailOrPhone: '', password: '' };

        validate.validateLogin(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('errors'))).to.be.true;
    });
});
