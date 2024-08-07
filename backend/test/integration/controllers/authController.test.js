import * as chai from 'chai';
import sinon from 'sinon';
import app from '../../../server.js';
import User from '../../../models/User.js';
import jwt from 'jsonwebtoken';
import config from '../../../config/config.js';
import * as authController from '../../../controllers/authController.js';

const { expect } = chai;

describe('Auth Controller Tests', () => {
    let req, res, sandbox;

    beforeEach(async () => {
        await User.deleteMany({});
        sandbox = sinon.createSandbox();
        req = { body: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            send: sinon.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should register a new user', async () => {
        req.body = { username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' };

        await authController.register(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });

    it('should not register a user with existing email or phone', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        
        req.body = { username: 'testuser2', email: 'testuser@example.com', phone: '0987654321', password: 'password123' };

        await authController.register(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });

    it('should login an existing user', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        
        req.body = { email: 'testuser@example.com', password: 'password123' };

        await authController.login(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });

    it('should not login a user with incorrect password', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        
        req.body = { email: 'testuser@example.com', password: 'wrongpassword' };

        await authController.login(req, res);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });

    it('should send a password reset token', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        
        req.body = { email: 'testuser@example.com' };

        await authController.forgotPassword(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });

    it('should reset the password with valid token and security answers', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        
        // Generate a token for the user
        const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });

        // Mock security answers
        const securityAnswers = ['answer1', 'answer2'];

        // Save the token and security answers to the user model for testing
        user.resetPasswordToken = token;
        user.securityAnswers = securityAnswers;
        await user.save();

        req.body = { token, newPassword: 'newpassword123', securityAnswers };

        await authController.resetPassword(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });
});
