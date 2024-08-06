import '../../setup.js';
import '../../teardown.js';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Controller Tests', () => {
    it('should register a new user', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'First pet?', answer: 'Fluffy' },
                    { question: 'Mother\'s maiden name?', answer: 'Smith' },
                    { question: 'Favorite color?', answer: 'Blue' }
                ]
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'User registered successfully');
                done();
            });
    });

    it('should not register a user with existing email or phone', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser2',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'First pet?', answer: 'Fluffy' },
                    { question: 'Mother\'s maiden name?', answer: 'Smith' },
                    { question: 'Favorite color?', answer: 'Blue' }
                ]
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').that.includes('already exists');
                done();
            });
    });

    it('should login an existing user', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                emailOrPhone: 'testuser@example.com',
                password: 'password123'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Logged in successfully');
                done();
            });
    });

    it('should not login a user with incorrect password', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                emailOrPhone: 'testuser@example.com',
                password: 'wrongpassword'
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('message', 'Invalid credentials');
                done();
            });
    });

    it('should send a password reset token', (done) => {
        chai.request(app)
            .post('/api/auth/forgot-password')
            .send({
                email: 'testuser@example.com'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Password reset token sent');
                done();
            });
    });

    it('should reset the password with valid token and security answers', (done) => {
        const resetToken = 'valid_reset_token';
        chai.request(app)
            .put(`/api/auth/reset-password/${resetToken}`)
            .send({
                password: 'newpassword123',
                securityAnswers: ['Fluffy', 'Smith', 'Blue']
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Password has been reset successfully');
                done();
            });
    });
});
