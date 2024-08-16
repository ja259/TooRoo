import * as chai from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import server from '../../../server.js';
import config from '../../../config/config.js';

const { expect } = chai;
const request = supertest(server);

describe('Auth Routes Tests', () => {
    let token;

    before(() => {
        const userPayload = { id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' };
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });
    });

    it('should register a new user', (done) => {
        request
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'Question1', answer: 'Answer1' },
                    { question: 'Question2', answer: 'Answer2' },
                    { question: 'Question3', answer: 'Answer3' },
                ],
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'User registered successfully');
                done();
            });
    });

    it('should login an existing user', (done) => {
        request
            .post('/api/auth/login')
            .send({ emailOrPhone: 'testuser@example.com', password: 'password123' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should reset the password with valid token and security answers', (done) => {
        request
            .put('/api/auth/reset-password/validToken')
            .send({
                password: 'newpassword123',
                securityAnswers: [
                    { question: 'Question1', answer: 'Answer1' },
                    { question: 'Question2', answer: 'Answer2' },
                    { question: 'Question3', answer: 'Answer3' },
                ],
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Password reset successfully');
                done();
            });
    });
});
