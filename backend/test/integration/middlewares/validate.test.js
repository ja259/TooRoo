import * as chai from 'chai';
import '../../setup.js';
import '../../teardown.js';
import app from '../../../server.js';

const { expect } = chai;

describe('Validation Middleware Tests', () => {
    it('should validate register request', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should return validation error for invalid register request', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: '', email: 'invalidemail', phone: 'invalidphone', password: '' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should validate login request', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return validation error for invalid login request', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'invalidemail', password: '' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });
});
