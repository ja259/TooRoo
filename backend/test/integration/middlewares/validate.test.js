import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Validation Middleware Tests', () => {
    it('should validate register request', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'First pet?', answer: 'Fluffy' },
                    { question: 'Mother\'s maiden name?', answer: 'Smith' },
                    { question: 'Favorite color?', answer: 'Blue' }
                ]
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'User registered successfully');
                done();
            });
    });

    it('should return validation error for invalid register request', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({
                username: '',
                email: 'invalidemail',
                phone: 'invalidphone',
                password: 'short',
                securityQuestions: [
                    { question: 'First pet?', answer: '' },
                    { question: 'Mother\'s maiden name?', answer: '' },
                    { question: 'Favorite color?', answer: '' }
                ]
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should validate login request', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                emailOrPhone: 'testuser@example.com',
                password: 'password123'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return validation error for invalid login request', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                emailOrPhone: '',
                password: ''
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should validate forgot password request', (done) => {
        chai.request(app)
            .post('/api/auth/forgot-password')
            .send({
                email: 'testuser@example.com'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return validation error for invalid forgot password request', (done) => {
        chai.request(app)
            .post('/api/auth/forgot-password')
            .send({
                email: ''
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should validate reset password request', (done) => {
        chai.request(app)
            .put('/api/auth/reset-password/valid_token')
            .send({
                password: 'newpassword123',
                securityAnswers: ['Fluffy', 'Smith', 'Blue']
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return validation error for invalid reset password request', (done) => {
        chai.request(app)
            .put('/api/auth/reset-password/valid_token')
            .send({
                password: 'short',
                securityAnswers: ['', '', '']
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });
});
