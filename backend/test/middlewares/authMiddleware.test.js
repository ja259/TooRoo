const chai = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { authenticate } = require('../../middlewares/authMiddleware');
const should = chai.should();

describe('Auth Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer validtoken'
            }
        };
        res = {
            status: sinon.stub().returns({ json: sinon.stub() })
        };
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
