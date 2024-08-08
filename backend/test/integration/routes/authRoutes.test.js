import * as chai from 'chai';
import chaiHttp from 'chai-http';
import '../../setup.js';
import '../../teardown.js';
import server from '../../../server.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Auth Routes Tests', () => {
    it('should register a new user', (done) => {
        chai.request(server)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: ['Question1', 'Question2', 'Question3']
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
            .send({ emailOrPhone: 'testuser@example.com', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Logged in successfully');
                done();
            });
    });

    it('should reset the password with valid token and security answers', (done) => {
        chai.request(server)
            .put('/api/auth/reset-password/validtoken')
            .send({
                password: 'newpassword123',
                securityAnswers: ['Answer1', 'Answer2', 'Answer3']
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Password has been reset successfully');
                done();
            });
    });
});
