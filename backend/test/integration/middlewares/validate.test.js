import * as chai from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';
import bodyParser from 'body-parser';
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../../../middlewares/validate.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Validation Middleware Tests', () => {
    let app;

    before(() => {
        app = express();
        app.use(bodyParser.json());

        app.post('/test/register', validateRegister, (req, res) => {
            res.status(200).send('Valid');
        });

        app.post('/test/login', validateLogin, (req, res) => {
            res.status(200).send('Valid');
        });

        app.post('/test/forgot-password', validateForgotPassword, (req, res) => {
            res.status(200).send('Valid');
        });

        app.put('/test/reset-password', validateResetPassword, (req, res) => {
            res.status(200).send('Valid');
        });
    });

    it('should validate register request', (done) => {
        chai.request(app)
            .post('/test/register')
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
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Valid');
                done();
            });
    });

    it('should return validation error for invalid register request', (done) => {
        chai.request(app)
            .post('/test/register')
            .send({
                username: '',
                email: 'invalidemail',
                phone: '123',
                password: '123',
                securityQuestions: [
                    { question: '', answer: '' },
                    { question: '', answer: '' }
                ]
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errors).to.be.an('array');
                done();
            });
    });

    it('should validate login request', (done) => {
        chai.request(app)
            .post('/test/login')
            .send({
                emailOrPhone: 'testuser@example.com',
                password: 'password123'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Valid');
                done();
            });
    });

    it('should return validation error for invalid login request', (done) => {
        chai.request(app)
            .post('/test/login')
            .send({
                emailOrPhone: '',
                password: ''
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errors).to.be.an('array');
                done();
            });
    });

    it('should validate forgot password request', (done) => {
        chai.request(app)
            .post('/test/forgot-password')
            .send({
                email: 'testuser@example.com',
                securityAnswers: ['Fluffy', 'Smith', 'Blue']
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Valid');
                done();
            });
    });

    it('should return validation error for invalid forgot password request', (done) => {
        chai.request(app)
            .post('/test/forgot-password')
            .send({
                email: 'invalidemail',
                securityAnswers: ['']
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errors).to.be.an('array');
                done();
            });
    });

    it('should validate reset password request', (done) => {
        chai.request(app)
            .put('/test/reset-password')
            .send({
                password: 'newpassword123',
                securityAnswers: ['Fluffy', 'Smith', 'Blue']
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Valid');
                done();
            });
    });

    it('should return validation error for invalid reset password request', (done) => {
        chai.request(app)
            .put('/test/reset-password')
            .send({
                password: '123',
                securityAnswers: ['']
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errors).to.be.an('array');
                done();
            });
    });
});
