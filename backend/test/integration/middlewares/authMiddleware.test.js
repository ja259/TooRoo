import '../../setup.js';
import '../../teardown.js';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Middleware Tests', () => {
    let userToken;

    before(async () => {
        await User.deleteMany({});
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
        userToken = user.generateAuthToken();
    });

    it('should authenticate a valid token', (done) => {
        chai.request(app)
            .get('/api/protected-route')
            .set('Authorization', `Bearer ${userToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return 401 for an invalid token', (done) => {
        chai.request(app)
            .get('/api/protected-route')
            .set('Authorization', 'Bearer invalidtoken')
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should return 401 if token is not provided', (done) => {
        chai.request(app)
            .get('/api/protected-route')
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should call next for authenticated user', (done) => {
        chai.request(app)
            .get('/api/protected-route')
            .set('Authorization', `Bearer ${userToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return 403 if user does not exist', (done) => {
        const invalidToken = new User({ _id: 'invalidUserId' }).generateAuthToken();
        chai.request(app)
            .get('/api/protected-route')
            .set('Authorization', `Bearer ${invalidToken}`)
            .end((err, res) => {
                expect(res).to.have.status(403);
                done();
            });
    });
});
