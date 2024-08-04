import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Routes Tests', () => {
    before(async () => {
        await User.deleteMany();
    });

    it('should register a new user', (done) => {
        chai.request(server)
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

    it('should login an existing user', (done) => {
        chai.request(server)
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

    it('should send a password reset token', (done) => {
        chai.request(server)
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
        chai.request(server)
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
