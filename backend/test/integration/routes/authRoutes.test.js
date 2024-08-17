import * as chai from 'chai';
import supertest from 'supertest';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import server from '../../../server.js';

// Import setup and teardown scripts
import '../../setup.js';
import '../../teardown.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { expect } = chai;
const request = supertest(server);

describe('Auth Routes Tests', () => {
    it('should register a new user', (done) => {
        request.post('/api/auth/register')
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
        request.post('/api/auth/login')
            .send({ emailOrPhone: 'testuser@example.com', password: 'password123' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('token');
                done();
            });
    });
});
