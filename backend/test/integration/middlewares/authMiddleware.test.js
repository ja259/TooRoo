import * as chai from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { authenticate, protect } from '../../../middlewares/authMiddleware.js';
import User from '../../../models/User.js';

chai.should();

describe('Auth Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: { authorization: 'Bearer validtoken' } };
        res = { status: sinon.stub().returns({ json: sinon.stub() }) };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('authenticate', () => {
        it('should authenticate a valid token', async () => {
            sinon.stub(jwt, 'verify').returns({ userId: 'userId' });

            await authenticate(req, res, next);
            next.calledOnce.should.be.true;
            req.should.have.property('user').eql('userId');
        });

        it('should return 401 for an invalid token', async () => {
            sinon.stub(jwt, 'verify').throws();

            await authenticate(req, res, next);
            res.status.calledWith(401).should.be.true;
            res.status().json.calledWithMatch({ message: 'Token is not valid' }).should.be.true;
        });

        it('should return 401 if no token is provided', async () => {
            req.headers.authorization = undefined;

            await authenticate(req, res, next);
            res.status.calledWith(401).should.be.true;
            res.status().json.calledWithMatch({ message: 'No token, authorization denied' }).should.be.true;
        });
    });

    describe('protect', () => {
        it('should authorize a valid user', async () => {
            const user = new User({ _id: 'userId', username: 'testuser' });
            sinon.stub(User, 'findById').returns(user);

            req.user = 'userId';
            await protect(req, res, next);
            next.calledOnce.should.be.true;
            req.should.have.property('user').eql(user);
        });

        it('should return 401 if user is not found', async () => {
            sinon.stub(User, 'findById').returns(null);

            req.user = 'userId';
            await protect(req, res, next);
            res.status.calledWith(401).should.be.true;
            res.status().json.calledWithMatch({ message: 'Not authorized, user not found' }).should.be.true;
        });

        it('should return 401 if there is an error', async () => {
            sinon.stub(User, 'findById').throws();

            req.user = 'userId';
            await protect(req, res, next);
            res.status.calledWith(401).should.be.true;
            res.status().json.calledWithMatch({ message: 'Not authorized' }).should.be.true;
        });
    });
});
