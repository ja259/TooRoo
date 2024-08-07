import * as chai from 'chai';
import sinon from 'sinon';
import * as validate from '../../../middlewares/validate.js';

const { expect } = chai;

describe('Validation Middleware Tests', () => {
    let req, res, next, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = { body: {} };
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub()
        };
        next = sandbox.stub();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should validate register request', async () => {
        req.body = { username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' };
        await validate.register(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    it('should return validation error for invalid register request', async () => {
        req.body = { email: 'testuser@example.com', phone: '1234567890', password: 'password123' };
        await validate.register(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });

    it('should validate login request', async () => {
        req.body = { email: 'testuser@example.com', password: 'password123' };
        await validate.login(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    it('should return validation error for invalid login request', async () => {
        req.body = { email: 'testuser@example.com' };
        await validate.login(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });
});
