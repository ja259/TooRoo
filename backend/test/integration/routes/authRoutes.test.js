import * as chai from 'chai';
import chaiHttp from 'chai-http';
import '../../setup.js';
import '../../teardown.js';
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

    it('should login an existing user', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        return chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'password123' })
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });

    it('should send a password reset token', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        return chai.request(app)
            .post('/api/auth/forgot-password')
            .send({ email: 'testuser@example.com' })
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });

    it('should reset the password with valid token and security answers', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123', resetPasswordToken: 'validtoken', resetPasswordExpires: Date.now() + 3600000 });
        await user.save();
        return chai.request(app)
            .post('/api/auth/reset-password')
            .send({ token: 'validtoken', password: 'newpassword123' })
            .then((res) => {
                expect(res).to.have.status(200);
            });
    });
});
