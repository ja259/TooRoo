import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Middleware Tests', () => {
    it('should authenticate a valid token', (done) => {
        const token = 'valid-token'; // Replace with a method to generate a valid token
        chai.request(app)
            .get('/protected-route')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return 401 for an invalid token', (done) => {
        const token = 'invalid-token';
        chai.request(app)
            .get('/protected-route')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should return 401 if token is not provided', (done) => {
        chai.request(app)
            .get('/protected-route')
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should call next for authenticated user', (done) => {
        const token = 'valid-token'; // Replace with a method to generate a valid token
        chai.request(app)
            .get('/protected-route')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return 403 if user does not exist', (done) => {
        const token = 'valid-token-for-nonexistent-user';
        chai.request(app)
            .get('/protected-route')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
    });
});

describe('Error Handler Middleware Tests', () => {
    it('should return 404 for not found route', (done) => {
        chai.request(app)
            .get('/nonexistent-route')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should handle an error', (done) => {
        chai.request(app)
            .get('/route-that-causes-error')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('should handle an error without status', (done) => {
        chai.request(app)
            .get('/route-that-causes-error-without-status')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });
});

describe('Validation Middleware Tests', () => {
    it('should validate register request', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', email: 'test@example.com', phone: '1234567890', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should return validation error for invalid register request', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: '', email: 'invalidemail', phone: 'invalidphone', password: 'short' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should validate login request', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return validation error for invalid login request', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'invalidemail', password: 'short' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should validate forgot password request', (done) => {
        chai.request(app)
            .post('/api/auth/forgot-password')
            .send({ email: 'test@example.com' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return validation error for invalid forgot password request', (done) => {
        chai.request(app)
            .post('/api/auth/forgot-password')
            .send({ email: 'invalidemail' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should validate reset password request', (done) => {
        const token = 'valid-token'; // Replace with a valid token
        chai.request(app)
            .put(`/api/auth/reset-password/${token}`)
            .send({ password: 'newpassword123', securityAnswers: ['answer1', 'answer2', 'answer3'] })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return validation error for invalid reset password request', (done) => {
        const token = 'valid-token'; // Replace with a valid token
        chai.request(app)
            .put(`/api/auth/reset-password/${token}`)
            .send({ password: 'short', securityAnswers: ['answer1', 'answer2'] })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });
});
