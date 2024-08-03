import * as chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import config from '../../../config/config.js';
import User from '../../../models/User.js';
import server from '../../../server.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Middleware Tests', () => {
    let userToken;
    let userId;

    before(async () => {
        await User.deleteMany();

        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: [
                { question: 'First pet?', answer: 'Fluffy' },
                { question: 'Mother\'s maiden name?', answer: 'Smith' },
                { question: 'Favorite color?', answer: 'Blue' }
            ]
        });
        await user.save();
        userToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
        userId = user._id;
    });

    describe('authenticate', () => {
        it('should authenticate a valid token', (done) => {
            chai.request(server)
                .get('/api/protected')
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('should return 401 for an invalid token', (done) => {
            chai.request(server)
                .get('/api/protected')
                .set('Authorization', 'Bearer invalid_token')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });

        it('should return 401 if token is not provided', (done) => {
            chai.request(server)
                .get('/api/protected')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });

    describe('protect', () => {
        it('should call next for authenticated user', (done) => {
            chai.request(server)
                .get('/api/protected')
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('should return 403 if user does not exist', (done) => {
            const invalidUserToken = jwt.sign({ userId: 'invalid_user_id' }, config.jwtSecret, { expiresIn: '1h' });
            chai.request(server)
                .get('/api/protected')
                .set('Authorization', `Bearer ${invalidUserToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(403);
                    done();
                });
        });
    });
});
