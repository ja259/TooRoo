import * as chai from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../middlewares/authMiddleware.js';
import { errorHandler } from '../../middlewares/errorHandler.js';
import User from '../../models/User.js';

chai.should();

describe('Auth Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: { authorization: 'Bearer validtoken' } };
        res = { status: sinon.stub().returns({ json: sinon.stub() }) };
        next = sinon.stub();
    });

    it('should authenticate a valid token', async () => {
        const user = new User({ _id: 'userId', username: 'testuser' });
        sinon.stub(jwt, 'verify').returns({ userId: 'userId' });
        sinon.stub(User, 'findById').returns(user);

        await authenticate(req, res, next);
        next.calledOnce.should.be.true;
        req.should.have.property('user').eql(user);

        jwt.verify.restore();
        User.findById.restore();
    });

    it('should return 401 for an invalid token', async () => {
        sinon.stub(jwt, 'verify').throws();

        await authenticate(req, res, next);
        res.status.calledWith(401).should.be.true;

        jwt.verify.restore();
    });
});

describe('Error Handler Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        res = { status: sinon.stub().returns({ json: sinon.stub() }) };
        next = sinon.stub();
    });

    it('should handle errors correctly', () => {
        const error = new Error('Test Error');
        error.statusCode = 400;

        errorHandler(error, req, res, next);
        res.status.calledWith(400).should.be.true;
        res.status().json.calledWithMatch({ success: false, message: 'Test Error' }).should.be.true;
    });

    it('should include stack trace in development mode', () => {
        process.env.NODE_ENV = 'development';
        const error = new Error('Test Error');

        errorHandler(error, req, res, next);
        res.status().json.calledWithMatch({ stack: error.stack }).should.be.true;
    });
});
