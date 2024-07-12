import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Controller Tests', () => {
    let token, userId;

    before(async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        const savedUser = await user.save();
        userId = savedUser._id;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    after(async () => {
        await User.deleteMany({});
    });

    describe('GET /api/users/:id', () => {
        it('should get user details', (done) => {
            chai.request(server)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.user).to.have.property('username', 'testuser');
                    done();
                });
        });

        it('should return 404 for non-existent user', (done) => {
            chai.request(server)
                .get('/api/users/invalidId')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message', 'User not found');
                    done();
                });
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update user profile', (done) => {
            const updatedUser = {
                username: 'updateduser',
                bio: 'Updated bio'
            };
            chai.request(server)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedUser)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'User profile updated successfully.');
                    done();
                });
        });
    });

    describe('POST /api/users/:id/follow', () => {
        let userToFollowId;

        before(async () => {
            const userToFollow = new User({
                username: 'followuser',
                email: 'followuser@example.com',
                password: 'password123'
            });
            const savedUserToFollow = await userToFollow.save();
            userToFollowId = savedUserToFollow._id;
        });

        it('should follow a user', (done) => {
            chai.request(server)
                .post(`/api/users/${userToFollowId}/follow`)
                .set('Authorization', `Bearer ${token}`)
                .send({ userId })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Followed user successfully.');
                    done();
                });
        });
    });

    describe('POST /api/users/:id/unfollow', () => {
        let userToUnfollowId;

        before(async () => {
            const userToUnfollow = new User({
                username: 'unfollowuser',
                email: 'unfollowuser@example.com',
                password: 'password123'
            });
            const savedUserToUnfollow = await userToUnfollow.save();
            userToUnfollowId = savedUserToUnfollow._id;

            // Follow the user first
            const currentUser = await User.findById(userId);
            currentUser.following.push(userToUnfollowId);
            await currentUser.save();
        });

        it('should unfollow a user', (done) => {
            chai.request(server)
                .post(`/api/users/${userToUnfollowId}/unfollow`)
                .set('Authorization', `Bearer ${token}`)
                .send({ userId })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Unfollowed user successfully.');
                    done();
                });
        });
    });

    describe('GET /api/users/analytics', () => {
        it('should get user analytics', (done) => {
            chai.request(server)
                .get('/api/users/analytics')
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
