import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB, disconnectDB } from '../../../db.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Controller Tests', () => {
    before(async () => {
        await connectDB();
    });

    after(async () => {
        await disconnectDB();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', (done) => {
            const user = {
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'What is your pet’s name?', answer: 'Fluffy' },
                    { question: 'What is your mother’s maiden name?', answer: 'Smith' },
                    { question: 'What is your favorite color?', answer: 'Blue' }
                ]
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message', 'User registered successfully');
                    done();
                });
        });

        it('should not register a user with existing email or phone', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'What is your pet’s name?', answer: 'Fluffy' },
                    { question: 'What is your mother’s maiden name?', answer: 'Smith' },
                    { question: 'What is your favorite color?', answer: 'Blue' }
                ]
            });
            user.save().then(() => {
                chai.request(server)
                    .post('/api/auth/register')
                    .send({
                        username: 'testuser2',
                        email: 'testuser@example.com',
                        phone: '1234567891',
                        password: 'password1234',
                        securityQuestions: [
                            { question: 'What is your pet’s name?', answer: 'Fluffy' },
                            { question: 'What is your mother’s maiden name?', answer: 'Smith' },
                            { question: 'What is your favorite color?', answer: 'Blue' }
                        ]
                    })
                    .end((err, res) => {
                        expect(res).to.have.status(409);
                        expect(res.body).to.have.property('message', 'Email or phone already registered');
                        done();
                    });
            });
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: bcrypt.hashSync('password123', 10),
                securityQuestions: [
                    { question: 'What is your pet’s name?', answer: 'Fluffy' },
                    { question: 'What is your mother’s maiden name?', answer: 'Smith' },
                    { question: 'What is your favorite color?', answer: 'Blue' }
                ]
            });
            user.save().then(() => {
                chai.request(server)
                    .post('/api/auth/login')
                    .send({ emailOrPhone: 'testuser@example.com', password: 'password123' })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('token');
                        done();
                    });
            });
        });

        it('should not login a user with incorrect password', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: bcrypt.hashSync('password123', 10),
                securityQuestions: [
                    { question: 'What is your pet’s name?', answer: 'Fluffy' },
                    { question: 'What is your mother’s maiden name?', answer: 'Smith' },
                    { question: 'What is your favorite color?', answer: 'Blue' }
                ]
            });
            user.save().then(() => {
                chai.request(server)
                    .post('/api/auth/login')
                    .send({ emailOrPhone: 'testuser@example.com', password: 'wrongpassword' })
                    .end((err, res) => {
                        expect(res).to.have.status(401);
                        expect(res.body).to.have.property('message', 'Invalid credentials');
                        done();
                    });
            });
        });
    });

    describe('POST /api/auth/forgot-password', () => {
        it('should send a password reset token', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'What is your pet’s name?', answer: 'Fluffy' },
                    { question: 'What is your mother’s maiden name?', answer: 'Smith' },
                    { question: 'What is your favorite color?', answer: 'Blue' }
                ]
            });
            user.save().then(() => {
                chai.request(server)
                    .post('/api/auth/forgot-password')
                    .send({ email: 'testuser@example.com' })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message', 'Password reset token sent');
                        done();
                    });
            });
        });
    });

    describe('PUT /api/auth/reset-password', () => {
        it('should reset the password with valid token and security answers', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'What is your pet’s name?', answer: 'Fluffy' },
                    { question: 'What is your mother’s maiden name?', answer: 'Smith' },
                    { question: 'What is your favorite color?', answer: 'Blue' }
                ],
                resetPasswordToken: crypto.createHash('sha256').update('testtoken').digest('hex'),
                resetPasswordExpires: Date.now() + 3600000
            });
            user.save().then(() => {
                chai.request(server)
                    .put('/api/auth/reset-password')
                    .send({
                        token: 'testtoken',
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
    });
});
