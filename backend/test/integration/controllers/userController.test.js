import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Controller Tests', () => {
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
        userToken = user.generateAuthToken();
        userId = user._id;
    });

    describe('GET /api/users/:id', () => {
        it('should get user details', (done) => {
            chai.request(app)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'User profile retrieved successfully');
                    done();
                });
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update user details', (done) => {
            chai.request(app)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ username: 'updatedtestuser' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'User profile updated successfully');
                    done();
                });
        });
    });

    describe('POST /api/users/:id/follow', () => {
        it('should follow a user', (done) => {
            chai.request(app)
                .post(`/api/users/${userId}/follow`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ userId: 'followUserId' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Followed user successfully');
                    done();
                });
        });
    });

    describe('POST /api/users/:id/unfollow', () => {
        it('should unfollow a user', (done) => {
            chai.request(app)
                .post(`/api/users/${userId}/unfollow`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ userId: 'unfollowUserId' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Unfollowed user successfully');
                    done();
                });
        });
    });

    describe('GET /api/users/analytics', () => {
        it('should get user analytics', (done) => {
            chai.request(app)
                .get('/api/users/analytics')
                .set('Authorization', `Bearer ${userToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('posts');
                    expect(res.body).to.have.property('followers');
                    expect(res.body).to.have.property('following');
                    expect(res.body).to.have.property('likes');
                    expect(res.body).to.have.property('comments');
                    done();
                });
        });
    });
});
