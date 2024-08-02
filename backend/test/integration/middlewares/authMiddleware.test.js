import * as chai from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { authenticate, protect } from '../../../middlewares/authMiddleware.js';
import User from '../../../models/User.js';

const { expect } = chai;

describe('Auth Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
        next = sinon.stub();
    });

    describe('authenticate', () => {
        it('should authenticate a valid token', async () => {
            const userId = 'testUserId';
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            req.headers.authorization = `Bearer ${token}`;

            sinon.stub(User, 'findById').resolves({ _id: userId });

            await authenticate(req, res, next);

            expect(req.user).to.have.property('_id', userId);
            expect(next.calledOnce).to.be.true;
            User.findById.restore();
        });

        it('should return 401 for an invalid token', async () => {
            req.headers.authorization = 'Bearer invalidtoken';

            await authenticate(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'Not authorized, token failed' })).to.be.true;
        });

        it('should return 401 if token is not provided', async () => {
            await authenticate(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'Not authorized, no token' })).to.be.true;
        });
    });

    describe('protect', () => {
        it('should call next for authenticated user', async () => {
            req.user = { _id: 'testUserId' };
            sinon.stub(User, 'findById').resolves(req.user);

            await protect(req, res, next);

            expect(next.calledOnce).to.be.true;
            User.findById.restore();
        });

        it('should return 403 if user does not exist', async () => {
            req.user = { _id: 'testUserId' };
            sinon.stub(User, 'findById').resolves(null);

            await protect(req, res, next);

            expect(res.status.calledWith(403)).to.be.true;
            expect(res.json.calledWith({ message: 'User not found' })).to.be.true;
            User.findById.restore();
        });
    });
});
