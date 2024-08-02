import * as chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import mongoose from 'mongoose';
import app from '../../../server.js';
import User from '../../../models/User.js';
import { connectDB, disconnectDB } from '../../../db.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Auth Controller Tests', () => {
    let userStub;

    before(async () => {
        await connectDB();
    });

    after(async () => {
        await disconnectDB();
    });

    beforeEach(() => {
        userStub = sinon.stub(User.prototype, 'save').resolves();
    });

    afterEach(() => {
        userStub.restore();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', (done) => {
            const user = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            chai.request(app)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message').eql('User registered successfully');
                    done();
                });
        });

        it('should not register a user with existing email or phone', (done) => {
            userStub.restore(); // Restore original save method to handle error
            const user = new User({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            user.save();

            const duplicateUser = {
                name: 'Another User',
                email: 'test@example.com',
                password: 'password123'
            };

            chai.request(app)
                .post('/api/auth/register')
                .send(duplicateUser)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('message').eql('Email already exists');
                    done();
                });
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user', (done) => {
            const user = new User({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            user.save();

            const credentials = {
                email: 'test@example.com',
                password: 'password123'
            };

            chai.request(app)
                .post('/api/auth/login')
                .send(credentials)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('token');
                    done();
                });
        });

        it('should not login a user with incorrect password', (done) => {
            const user = new User({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            user.save();

            const credentials = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            chai.request(app)
                .post('/api/auth/login')
                .send(credentials)
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('message').eql('Invalid credentials');
                    done();
                });
        });
    });

    describe('POST /api/auth/forgot-password', () => {
        it('should send a password reset token', (done) => {
            const user = new User({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            user.save();

            chai.request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'test@example.com' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').eql('Password reset token sent');
                    done();
                });
        });
    });

    describe('PUT /api/auth/reset-password', () => {
        it('should reset the password with valid token and security answers', (done) => {
            const user = new User({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            user.save();

            const token = user.generatePasswordResetToken();
            user.save();

            const newPassword = 'newpassword123';

            chai.request(app)
                .put(`/api/auth/reset-password/${token}`)
                .send({ password: newPassword })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').eql('Password reset successful');
                    done();
                });
        });
    });
});
