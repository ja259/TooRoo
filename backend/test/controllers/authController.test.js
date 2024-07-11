import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Controller Tests', () => {
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
                securityQuestions: ['Answer 1', 'Answer 2', 'Answer 3']
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message', 'User registered successfully');
                    expect(res.body).to.have.property('token');
                    done();
                });
        });

        it('should not register a user with existing email or phone', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: ['Answer 1', 'Answer 2', 'Answer 3']
            });
            user.save().then(() => {
                chai.request(server)
                    .post('/api/auth/register')
                    .send({
                        username: 'testuser2',
                        email: 'testuser@example.com',
                        phone: '0987654321',
                        password: 'password1234',
                        securityQuestions: ['Answer 1', 'Answer 2', 'Answer 3']
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
                password: bcrypt.hashSync('password123', 12),
                securityQuestions: ['Answer 1', 'Answer 2', 'Answer 3']
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
                password: bcrypt.hashSync('password123', 12),
                securityQuestions: ['Answer 1', 'Answer 2', 'Answer 3']
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
});
