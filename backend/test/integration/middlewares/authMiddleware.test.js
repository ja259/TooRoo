import * as chai from 'chai';
import sinon from 'sinon';
import User from '../../../models/User.js';
import * as authMiddleware from '../../../middlewares/authMiddleware.js';

const { expect } = chai;

describe('Auth Middleware Tests', () => {
    let req, res, next, sandbox, authToken;

    before(async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        authToken = user.generateAuthToken();
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = { headers: { authorization: `Bearer ${authToken}` } };
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub(),
            send: sandbox.stub()
        };
        next = sandbox.stub();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should authenticate a valid token', async () => {
        await authMiddleware.authenticate(req, res, next);

        expect(next.calledOnce).to.be.true;
    });
});
