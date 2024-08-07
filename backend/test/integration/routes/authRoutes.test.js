import * as chai from 'chai';
import '../../setup.js';
import '../../teardown.js';
import app from '../../../server.js';

const { expect } = chai;

describe('Auth Routes Tests', () => {
    it('should register a new user', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should login an existing user', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should send a password reset token', (done) => {
        chai.request(app)
            .post('/api/auth/forgot-password')
            .send({ email: 'testuser@example.com' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should reset the password with valid token and security answers', (done) => {
        chai.request(app)
            .post('/api/auth/reset-password')
            .send({ token: 'validtoken', newPassword: 'newpassword123', securityAnswers: ['answer1', 'answer2'] })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
