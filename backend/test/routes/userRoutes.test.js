import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
chai.use(chaiHttp);
chai.should();

describe('User Routes Tests', () => {

    before((done) => {
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => done())
            .catch(err => done(err));
    });

    after((done) => {
        mongoose.disconnect()
            .then(() => done())
            .catch(err => done(err));
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    let token = '';

    before((done) => {
        const user = new User({
            email: 'testuser@example.com',
            password: 'password123'
        });
        user.save((err, user) => {
            chai.request(server)
                .post('/api/auth/login')
                .send({ email: user.email, password: user.password })
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });
    });

    it('should get user details on /api/users/:id GET', (done) => {
        chai.request(server)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('username').eql('testuser');
                done();
            });
    });

    it('should update user profile on /api/users/:id PUT', (done) => {
        const updatedUser = {
            username: 'updateduser',
            bio: 'Updated bio'
        };
        chai.request(server)
            .put(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUser)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message').eql('User profile updated successfully.');
                done();
            });
    });

    it('should follow a user on /api/users/:id/follow POST', (done) => {
        const followUser = new User({
            username: 'followuser',
            email: 'followuser@example.com',
            password: 'password123'
        });
        followUser.save((err, followUser) => {
            chai.request(server)
                .post(`/api/users/${followUser._id}/follow`)
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: followUser._id })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Followed user successfully.');
                    done();
                });
        });
    });

    it('should unfollow a user on /api/users/:id/unfollow POST', (done) => {
        const unfollowUser = new User({
            username: 'unfollowuser',
            email: 'unfollowuser@example.com',
            password: 'password123'
        });
        unfollowUser.save((err, unfollowUser) => {
            chai.request(server)
                .post(`/api/users/${unfollowUser._id}/unfollow`)
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: unfollowUser._id })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Unfollowed user successfully.');
                    done();
                });
        });
    });
});
