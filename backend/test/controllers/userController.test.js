import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';
import { generateAuthToken } from '../../utils/authUtils.js';

should();
chai.use(chaiHttp);

describe('User Controller', () => {

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('/GET user profile', () => {
        it('it should GET a user profile by the given id', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                const token = generateAuthToken(user._id);
                chai.request(server)
                    .get(`/api/users/${user._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('User profile retrieved successfully');
                        res.body.user.should.have.property('username').eql('testuser');
                        done();
                    });
            });
        });
    });

    describe('/PUT update user profile', () => {
        it('it should update the user profile', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                const token = generateAuthToken(user._id);
                chai.request(server)
                    .put(`/api/users/${user._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ username: 'updateduser', bio: 'Updated bio', avatar: 'newavatarurl' })
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
    });

    describe('/POST follow user', () => {
        it('it should follow a user', (done) => {
            let user1 = new User({
                username: 'user1',
                email: 'user1@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            let user2 = new User({
                username: 'user2',
                email: 'user2@example.com',
                phone: '0987654321',
                password: 'password123'
            });
            user1.save((err, user1) => {
                user2.save((err, user2) => {
                    const token = generateAuthToken(user1._id);
                    chai.request(server)
                        .post(`/api/users/${user2._id}/follow`)
                        .set('Authorization', `Bearer ${token}`)
                        .send({ userId: user1._id })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Followed user successfully.');
                            done();
                        });
                });
            });
        });
    });

    describe('/POST unfollow user', () => {
        it('it should unfollow a user', (done) => {
            let user1 = new User({
                username: 'user1',
                email: 'user1@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            let user2 = new User({
                username: 'user2',
                email: 'user2@example.com',
                phone: '0987654321',
                password: 'password123'
            });
            user1.save((err, user1) => {
                user2.save((err, user2) => {
                    user1.following.push(user2._id);
                    user2.followers.push(user1._id);
                    user1.save((err, user1) => {
                        user2.save((err, user2) => {
                            const token = generateAuthToken(user1._id);
                            chai.request(server)
                                .post(`/api/users/${user2._id}/unfollow`)
                                .set('Authorization', `Bearer ${token}`)
                                .send({ userId: user1._id })
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
    });
});
