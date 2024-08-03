import * as chai from 'chai';
import sinon from 'sinon';
import { authenticate, protect } from '../../../middlewares/authMiddleware.js';
import User from '../../../models/User.js';
import jwt from 'jsonwebtoken';

const { expect } = chai;

describe('Auth Middleware Tests', () => {
    let user, token;

    before(async () => {
        user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            phone: '1234567890',
            securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
        });
        await user.save();
        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    it('should authenticate a valid token', (done) => {
        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };
        const res = {};
        const next = sinon.spy();

        authenticate(req, res, next);

        expect(next.calledOnce).to.be.true;
        done();
    });

    it('should return 401 for an invalid token', (done) => {
        const req = {
            headers: {
                authorization: 'Bearer invalidtoken'
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
        const next = sinon.spy();

        authenticate(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ message: 'Unauthorized' })).to.be.true;
        done();
    });

    it('should return 401 if token is not provided', (done) => {
        const req = {
            headers: {}
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
        const next = sinon.spy();

        authenticate(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({ message: 'Unauthorized' })).to.be.true;
        done();
    });

    it('should call next for authenticated user', (done) => {
        sinon.stub(User, 'findById').returns({
            exec: sinon.stub().resolves(user)
        });

        const req = {
            headers: {
                authorization: `Bearer ${token}`
            },
            user: user
        };
        const res = {};
        const next = sinon.spy();

        protect(req, res, next);

        expect(next.calledOnce).to.be.true;
        User.findById.restore();
        done();
    });

    it('should return 403 if user does not exist', (done) => {
        sinon.stub(User, 'findById').returns({
            exec: sinon.stub().resolves(null)
        });

        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
        const next = sinon.spy();

        protect(req, res, next);

        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith({ message: 'Forbidden' })).to.be.true;
        User.findById.restore();
        done();
    });
});
