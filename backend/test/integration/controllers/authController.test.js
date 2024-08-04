import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Controller Tests', () => {
    before(async () => {
        await User.deleteMany();
    });

    it('should register a new user', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', email: 'test@example.com', phone: '1234567890', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should not register a user with existing email or phone', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser2', email: 'test@example.com', phone: '1234567890', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should login an existing user', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should not login a user with incorrect password', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' })
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should send a password reset token', (done) => {
        chai.request(app)
            .post('/api/auth/forgot-password')
            .send({ email: 'test@example.com' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should reset the password with valid token and security answers', (done) => {
        // Assume you have generated a token for the test
        const token = 'valid-token';
        chai.request(app)
            .put(`/api/auth/reset-password/${token}`)
            .send({ password: 'newpassword123', securityAnswers: ['answer1', 'answer2', 'answer3'] })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
