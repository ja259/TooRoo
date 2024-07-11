import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';
import jwt from 'jsonwebtoken';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Controller Integration Tests', () => {
    let token, userId;

    before(async () => {
        await User.deleteMany({});

        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        const savedUser = await user.save();
        userId = savedUser._id;
        token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    after(async () => {
        await User.deleteMany({});
    });

    describe('GET /users/:id', () => {
        it('should get user profile', (done) => {
            chai.request(server)
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.user).to.have.property('username', 'testuser');
                    done();
                });
        });

        it('should return 404 for non-existent user', (done) => {
            chai.request(server)
                .get('/users/invalidId')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message', 'User not found!');
                    done();
                });
        });
    });

    describe('PUT /users/:id', () => {
        it('should update user profile', (done) => {
            const updatedUser = {
                username: 'updateduser',
                bio: 'Updated bio'
            };
            chai.request(server)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedUser)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'User profile updated successfully.');
                    expect(res.body.user).to.have.property('username', 'updateduser');
                    expect(res.body.user).to.have.property('bio', 'Updated bio');
                    done();
                });
        });
    });

    describe('POST /users/:id/follow', () => {
        it('should follow a user', (done) => {
            const targetUser = new User({
                username: 'targetuser',
                email: 'targetuser@example.com',
                phone: '0987654321',
                password: 'password123'
            });
            targetUser.save().then((savedTargetUser) => {
                chai.request(server)
                    .post(`/users/${savedTargetUser._id}/follow`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ userId })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message', 'Followed user successfully.');
                        expect(res.body.user.following).to.include(savedTargetUser._id.toString());
                        done();
                    });
            });
        });
    });

    describe('POST /users/:id/unfollow', () => {
        it('should unfollow a user', (done) => {
            const targetUser = new User({
                username: 'targetuser',
                email: 'targetuser@example.com',
                phone: '0987654321',
                password: 'password123'
            });
            targetUser.save().then((savedTargetUser) => {
                chai.request(server)
                    .post(`/users/${savedTargetUser._id}/unfollow`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ userId })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message', 'Unfollowed user successfully.');
                        expect(res.body.user.following).to.not.include(savedTargetUser._id.toString());
                        done();
                    });
            });
        });
    });

    describe('GET /users/analytics', () => {
        it('should get user analytics', (done) => {
            chai.request(server)
                .get('/users/analytics')
                .set('Authorization', `Bearer ${token}`)
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
