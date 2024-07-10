import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
chai.should();
chai.use(chaiHttp);

describe('User Routes', () => {
    let token;
    let userId;

    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.deleteMany({});
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        await user.save();
        token = user.generateAuthToken();
        userId = user._id.toString();
    });

    after(async () => {
        await mongoose.connection.close();
    });

    describe('/GET user profile', () => {
        it('it should GET a user profile by the given id', (done) => {
            chai.request(server)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('User profile retrieved successfully');
                    res.body.user.should.have.property('username').eql('testuser');
                    done();
                });
        });
    });

    describe('/PUT update user profile', () => {
        it('it should update the user profile', (done) => {
            const updateUser = {
                username: 'updateduser',
                bio: 'Updated bio',
                avatar: 'newavatarurl'
            };
            chai.request(server)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('User profile updated successfully.');
                    res.body.user.should.have.property('username').eql('updateduser');
                    res.body.user.should.have.property('bio').eql('Updated bio');
                    res.body.user.should.have.property('avatar').eql('newavatarurl');
                    done();
                });
        });
    });

    describe('/POST follow user', () => {
        it('should follow a user', (done) => {
            const user2 = new User({
                username: 'user2',
                email: 'user2@example.com',
                password: 'password123'
            });
            user2.save((err, user2) => {
                const token = user2.generateAuthToken();
                chai.request(server)
                    .post(`/api/users/${user2._id}/follow`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ userId })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Followed user successfully.');
                        done();
                    });
            });
        });
    });

    describe('/POST unfollow user', () => {
        it('should unfollow a user', (done) => {
            const user2 = new User({
                username: 'user2',
                email: 'user2@example.com',
                password: 'password123'
            });
            user2.save((err, user2) => {
                const token = user2.generateAuthToken();
                user2.following.push(userId);
                user2.save((err, user2) => {
                    chai.request(server)
                        .post(`/api/users/${user2._id}/unfollow`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ userId })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Unfollowed user successfully.');
                            done();
                        });
                });
            });
        });
    });
});
