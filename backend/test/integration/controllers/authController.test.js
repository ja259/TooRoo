import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Controller Tests', () => {
    before(async () => {
        await User.deleteMany({});
    });

    it('should register a new user', (done) => {
        chai.request(server)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
                phone: '1234567890',
                securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'User registered successfully');
                done();
            });
    });

    it('should not register a user with existing email or phone', (done) => {
        chai.request(server)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
                phone: '1234567890',
                securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message', 'Email or phone already exists');
                done();
            });
    });

    it('should login an existing user', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({ emailOrPhone: 'testuser@example.com', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should not login a user with incorrect password', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({ emailOrPhone: 'testuser@example.com', password: 'wrongpassword' })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('message', 'Invalid credentials');
                done();
            });
    });

    it('should send a password reset token', (done) => {
        chai.request(server)
            .post('/api/auth/forgot-password')
            .send({ email: 'testuser@example.com' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Password reset token sent');
                done();
            });
    });

    it('should reset the password with valid token and security answers', (done) => {
        chai.request(server)
            .put('/api/auth/reset-password')
            .send({ token: 'validtoken', newPassword: 'newpassword123', securityAnswers: ['a1', 'a2', 'a3'] })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Password reset successful');
                done();
            });
    });
});
