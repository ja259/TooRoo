import * as chai from 'chai';
import chaiHttp from 'chai-http';
import '../../setup.js';
import '../../teardown.js';
import app from '../../../server.js';
import User from '../../../models/User.js';
import jwt from 'jsonwebtoken';
import config from '../../../config/config.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Controller Tests', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should register a new user', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should not register a user with existing email or phone', async (done) => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();

        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser2', email: 'testuser@example.com', phone: '0987654321', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should login an existing user', async (done) => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();

        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should not login a user with incorrect password', async (done) => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();

        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'wrongpassword' })
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should send a password reset token', async (done) => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();

        chai.request(app)
            .post('/api/auth/forgot-password')
            .send({ email: 'testuser@example.com' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should reset the password with valid token and security answers', async (done) => {
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

        chai.request(app)
            .post('/api/auth/reset-password')
            .send({ token, newPassword: 'newpassword123', securityAnswers })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
