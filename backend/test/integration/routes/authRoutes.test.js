import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Routes Tests', () => {
    it('should register a new user', (done) => {
        chai.request(server)
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
            .end((err, res) => {
                if (err) return done(err);
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
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                done();
            });
    });
});
