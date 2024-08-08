import * as chai from 'chai';
import sinon from 'sinon';
import '../../setup.js';
import '../../teardown.js';
import * as authController from '../../../controllers/authController.js';
import User from '../../../models/User.js';

const { expect } = chai;

describe('Auth Controller Tests', () => {
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

    it('should register a new user', async () => {
        req.body = {
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: ['Question1', 'Question2', 'Question3']
        };

        sinon.stub(User.prototype, 'save').resolves({});
        sinon.stub(User, 'findOne').resolves(null);

        await authController.register(req, res, next);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('message', 'User registered successfully'))).to.be.true;
    });

    it('should login an existing user', async () => {
        req.body = { emailOrPhone: 'testuser@example.com', password: 'password123' };

        const user = new User({ email: 'testuser@example.com', password: 'password123' });
        sinon.stub(User, 'findOne').resolves(user);
        sinon.stub(user, 'comparePassword').resolves(true);

        await authController.login(req, res, next);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('message', 'Logged in successfully'))).to.be.true;
    });

    it('should not login a user with incorrect password', async () => {
        req.body = { emailOrPhone: 'testuser@example.com', password: 'wrongpassword' };

        const user = new User({ email: 'testuser@example.com', password: 'password123' });
        sinon.stub(User, 'findOne').resolves(user);
        sinon.stub(user, 'comparePassword').resolves(false);

        await authController.login(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('message', 'Invalid credentials'))).to.be.true;
    });

    it('should reset the password with valid token and security answers', async () => {
        req.body = {
            token: 'validtoken',
            password: 'newpassword123',
            securityAnswers: ['Answer1', 'Answer2', 'Answer3']
        };

        const user = new User({
            resetPasswordToken: 'hashedvalidtoken',
            resetPasswordExpires: Date.now() + 3600000,
            securityQuestions: [{ answer: 'Answer1' }, { answer: 'Answer2' }, { answer: 'Answer3' }]
        });
        sinon.stub(User, 'findOne').resolves(user);
        sinon.stub(user, 'save').resolves(user);

        await authController.resetPassword(req, res, next);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('message', 'Password has been reset successfully'))).to.be.true;
    });
});
