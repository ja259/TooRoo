import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import emailService from '../../utils/emailService.js';

const should = chai.should();
chai.use(chaiHttp);

describe('Auth Controller', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('/POST register', () => {
        it('should register a user', (done) => {
            const user = {
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'Question1', answer: 'Answer1' },
                    { question: 'Question2', answer: 'Answer2' },
                    { question: 'Question3', answer: 'Answer3' }
                ]
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('message').eql('User registered successfully');
                    done();
                });
        });
    });

    describe('/POST login', () => {
        it('should login a user', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'Question1', answer: 'Answer1' },
                    { question: 'Question2', answer: 'Answer2' },
                    { question: 'Question3', answer: 'Answer3' }
                ]
            });
            user.password = bcrypt.hashSync(user.password, 12);
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/auth/login')
                    .send({ emailOrPhone: 'testuser@example.com', password: 'password123' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Logged in successfully');
                        done();
                    });
            });
        });
    });

    describe('/POST forgotPassword', () => {
        it('should send a password reset token', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'Question1', answer: 'Answer1' },
                    { question: 'Question2', answer: 'Answer2' },
                    { question: 'Question3', answer: 'Answer3' }
                ]
            });
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/auth/forgot-password')
                    .send({ email: 'testuser@example.com' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Password reset token sent');
                        done();
                    });
            });
        });
    });

    describe('/PUT resetPassword', () => {
        it('should reset the user password', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'Question1', answer: 'Answer1' },
                    { question: 'Question2', answer: 'Answer2' },
                    { question: 'Question3', answer: 'Answer3' }
                ]
            });

            const resetToken = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save((err, user) => {
                const newPassword = 'newpassword123';
                chai.request(server)
                    .put(`/api/auth/reset-password/${resetToken}`)
                    .send({
                        token: resetToken,
                        password: newPassword,
                        securityAnswers: ['Answer1', 'Answer2', 'Answer3']
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Password has been reset successfully');
                        done();
                    });
            });
        });
    });
});
