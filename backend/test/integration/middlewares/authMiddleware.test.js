import * as chai from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { authenticate, protect } from '../../../middlewares/authMiddleware.js';
import User from '../../../models/User.js';

const { expect } = chai;

describe('Auth Middleware Tests', () => {
    let req, res, next, userStub;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
        userStub = sinon.stub(User, 'findById');
    });

    afterEach(() => {
        userStub.restore();
    });

    describe('authenticate', () => {
        it('should authenticate a valid token', () => {
            const token = jwt.sign({ id: 'userId' }, process.env.JWT_SECRET);
            req.headers.authorization = `Bearer ${token}`;
            userStub.resolves(new User({ _id: 'userId' }));

            authenticate(req, res, next);

            expect(next.calledOnce).to.be.true;
            expect(req.user).to.have.property('_id').eql('userId');
        });

        it('should return 401 for an invalid token', () => {
            req.headers.authorization = 'Bearer invalidToken';
            authenticate(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'Invalid token' })).to.be.true;
        });

        it('should return 401 if token is not provided', () => {
            authenticate(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'No token provided' })).to.be.true;
        });
    });

    describe('protect', () => {
        it('should call next for authenticated user', () => {
            req.user = { _id: 'userId' };
            userStub.resolves(new User({ _id: 'userId' }));

            protect(req, res, next);

            expect(next.calledOnce).to.be.true;
        });

        it('should return 403 if user does not exist', () => {
            req.user = { _id: 'nonexistentUserId' };
            userStub.resolves(null);

            protect(req, res, next);

            expect(res.status.calledWith(403)).to.be.true;
            expect(res.json.calledWith({ message: 'User not found' })).to.be.true;
        });
    });
});
