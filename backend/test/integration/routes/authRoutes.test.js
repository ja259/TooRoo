import * as chai from 'chai';
import supertest from 'supertest';
import '../../setup.js';
import '../../teardown.js';
import server from '../../../server.js';

const { expect } = chai;
const request = supertest(server);

describe('Auth Routes Tests', () => {
    it('should register a new user', (done) => {
        request
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: ['Question1', 'Question2', 'Question3']
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
                expect(res.body).to.have.property('message', 'Logged in successfully');
                done();
            });
    });

    it('should reset the password with valid token and security answers', (done) => {
        request
            .put('/api/auth/reset-password/validtoken')
            .send({
                password: 'newpassword123',
                securityAnswers: ['Answer1', 'Answer2', 'Answer3']
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Password has been reset successfully');
                done();
            });
    });
});
