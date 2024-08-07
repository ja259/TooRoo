import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Routes Tests', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should register a new user', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should login an existing user', (done) => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        user.save().then(() => {
            chai.request(app)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'password123' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    it('should send a password reset token', (done) => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        user.save().then(() => {
            chai.request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'testuser@example.com' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    it('should reset the password with valid token and security answers', (done) => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123', resetPasswordToken: 'validtoken', resetPasswordExpires: Date.now() + 3600000 });
        user.save().then(() => {
            chai.request(app)
                .post('/api/auth/reset-password')
                .send({ token: 'validtoken', password: 'newpassword123' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});
