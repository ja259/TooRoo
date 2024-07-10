import * as chai from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import app from '../../app.js';
import * as authController from '../../controllers/authController.js';

const { expect } = chai;

describe('Auth Routes', () => {
    describe('POST /register', () => {
        it('should call register controller', async () => {
            const stub = sinon.stub(authController, 'register').callsFake((req, res) => res.status(201).json({ message: 'User registered successfully' }));

            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123', securityQuestions: [{ question: 'Q1', answer: 'A1' }, { question: 'Q2', answer: 'A2' }, { question: 'Q3', answer: 'A3' }] });

            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal('User registered successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('POST /login', () => {
        it('should call login controller', async () => {
            const stub = sinon.stub(authController, 'login').callsFake((req, res) => res.status(200).json({ message: 'Logged in successfully' }));

            const res = await request(app)
                .post('/api/auth/login')
                .send({ emailOrPhone: 'testuser@example.com', password: 'password123' });

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Logged in successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('POST /forgot-password', () => {
        it('should call forgotPassword controller', async () => {
            const stub = sinon.stub(authController, 'forgotPassword').callsFake((req, res) => res.status(200).json({ message: 'Password reset token sent' }));

            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'testuser@example.com' });

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Password reset token sent');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('PUT /reset-password/:token', () => {
        it('should call resetPassword controller', async () => {
            const stub = sinon.stub(authController, 'resetPassword').callsFake((req, res) => res.status(200).json({ message: 'Password has been reset successfully' }));

            const res = await request(app)
                .put('/api/auth/reset-password/randomtoken')
                .send({ token: 'randomtoken', password: 'newpassword123', securityAnswers: ['A1', 'A2', 'A3'] });

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Password has been reset successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });
});
