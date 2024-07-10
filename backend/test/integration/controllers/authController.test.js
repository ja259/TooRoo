import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
chai.should();
chai.use(chaiHttp);

describe('Auth Controller', () => {
    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.close();
    });

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
            user.password = user.generateHash(user.password);
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

        it('should not login a user with incorrect password', (done) => {
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
            user.password = user.generateHash(user.password);
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/auth/login')
                    .send({ emailOrPhone: 'testuser@example.com', password: 'wrongpassword' })
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.have.property('message').eql('Invalid credentials');
                        done();
                    });
            });
        });
    });

    describe('/POST forgot-password', () => {
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

        it('should return 404 for non-existent email', (done) => {
            chai.request(server)
                .post('/api/auth/forgot-password')
                .send({ email: 'nonexistent@example.com' })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('User not found');
                    done();
                });
        });
    });

    describe('/PUT reset-password/:token', () => {
        it('should reset the password', (done) => {
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
                const resetToken = user.generateResetPasswordToken();
                user.resetPasswordToken = resetToken;
                user.resetPasswordExpires = Date.now() + 3600000;
                user.save((err, user) => {
                    chai.request(server)
                        .put(`/api/auth/reset-password/${resetToken}`)
                        .send({ password: 'newpassword123', securityAnswers: ['Answer1', 'Answer2', 'Answer3'] })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Password has been reset successfully');
                            done();
                        });
                });
            });
        });

        it('should return 400 for invalid or expired token', (done) => {
            chai.request(server)
                .put('/api/auth/reset-password/invalidtoken')
                .send({ password: 'newpassword123', securityAnswers: ['Answer1', 'Answer2', 'Answer3'] })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Token is invalid or has expired');
                    done();
                });
        });

        it('should return 400 for invalid security answers', (done) => {
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
                const resetToken = user.generateResetPasswordToken();
                user.resetPasswordToken = resetToken;
                user.resetPasswordExpires = Date.now() + 3600000;
                user.save((err, user) => {
                    chai.request(server)
                        .put(`/api/auth/reset-password/${resetToken}`)
                        .send({ password: 'newpassword123', securityAnswers: ['Wrong1', 'Wrong2', 'Wrong3'] })
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.have.property('message').eql('Invalid security answer');
                            done();
                        });
                });
            });
        });
    });
});
