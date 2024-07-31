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
            req.headers.authorization = 'Bearer invalidtoken';
            sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

            await authenticate(req, res, next);
            res.status.calledWith(401).should.be.true;
            res.status().json.calledWith({ message: 'Unauthorized' }).should.be.true;
        });

        it('should return 401 if token is not provided', async () => {
            req.headers.authorization = '';
            await authenticate(req, res, next);
            res.status.calledWith(401).should.be.true;
            res.status().json.calledWith({ message: 'Unauthorized' }).should.be.true;
        });
    });

    describe('protect', () => {
        it('should call next for authenticated user', async () => {
            req.user = { id: 'userId' };
            const userStub = sinon.stub(User, 'findById').returns({ id: 'userId' });

            await protect(req, res, next);
            next.calledOnce.should.be.true;
            userStub.calledOnceWith('userId').should.be.true;
        });

        it('should return 403 if user does not exist', async () => {
            req.user = { id: 'nonexistentUserId' };
            sinon.stub(User, 'findById').returns(null);

            await protect(req, res, next);
            res.status.calledWith(403).should.be.true;
            res.status().json.calledWith({ message: 'Forbidden' }).should.be.true;
        });
    });
});
