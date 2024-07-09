import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';

chai.should();
chai.use(chaiHttp);

describe('User Routes', () => {

    before(async () => {
        await User.deleteMany({});
    });

    after(async () => {
        await User.deleteMany({});
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('/GET user profile', () => {
        it('it should GET a user profile by the given id', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                fullName: 'Test User',
                birthdate: '1990-01-01',
                gender: 'male',
                securityQuestion1: 'Question 1',
                securityAnswer1: 'Answer 1',
                securityQuestion2: 'Question 2',
                securityAnswer2: 'Answer 2',
                securityQuestion3: 'Question 3',
                securityAnswer3: 'Answer 3'
            });
            user.save((err, user) => {
                chai.request(server)
                    .get(`/api/users/${user._id}`)
                    .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('User profile retrieved successfully');
                        res.body.user.should.have.property('username').eql('testuser');
                        done();
                    });
            });
        });

        it('it should return 404 for non-existent user', (done) => {
            chai.request(server)
                .get('/api/users/invalidid')
                .set('Authorization', 'Bearer invalidtoken')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('User not found!');
                    done();
                });
        });
    });

    describe('/PUT/:id update user profile', () => {
        it('it should UPDATE a user profile by the given id', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                fullName: 'Test User',
                birthdate: '1990-01-01',
                gender: 'male',
                securityQuestion1: 'Question 1',
                securityAnswer1: 'Answer 1',
                securityQuestion2: 'Question 2',
                securityAnswer2: 'Answer 2',
                securityQuestion3: 'Question 3',
                securityAnswer3: 'Answer 3'
            });
            user.save((err, user) => {
                chai.request(server)
                    .put(`/api/users/${user._id}`)
                    .set('Authorization', `Bearer ${user.generateAuthToken()}`)
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

        it('it should return 404 for non-existent user', (done) => {
            chai.request(server)
                .put('/api/users/invalidid')
                .set('Authorization', 'Bearer invalidtoken')
                .send({ username: 'updateduser', bio: 'Updated bio', avatar: 'newavatarurl' })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('User not found.');
                    done();
                });
        });
    });

    describe('/POST/:id/follow follow user', () => {
        it('it should follow a user by the given id', (done) => {
            let user1 = new User({
                username: 'user1',
                email: 'user1@example.com',
                phone: '1234567890',
                password: 'password123',
                fullName: 'User One',
                birthdate: '1990-01-01',
                gender: 'male',
                securityQuestion1: 'Question 1',
                securityAnswer1: 'Answer 1',
                securityQuestion2: 'Question 2',
                securityAnswer2: 'Answer 2',
                securityQuestion3: 'Question 3',
                securityAnswer3: 'Answer 3'
            });
            let user2 = new User({
                username: 'user2',
                email: 'user2@example.com',
                phone: '0987654321',
                password: 'password123',
                fullName: 'User Two',
                birthdate: '1990-01-01',
                gender: 'female',
                securityQuestion1: 'Question 1',
                securityAnswer1: 'Answer 1',
                securityQuestion2: 'Question 2',
                securityAnswer2: 'Answer 2',
                securityQuestion3: 'Question 3',
                securityAnswer3: 'Answer 3'
            });
            user1.save((err, user1) => {
                user2.save((err, user2) => {
                    chai.request(server)
                        .post(`/api/users/${user2._id}/follow`)
                        .set('Authorization', `Bearer ${user1.generateAuthToken()}`)
                        .send({ userId: user1._id })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Followed user successfully.');
                            done();
                        });
                });
            });
        });

        it('it should return 404 for non-existent user', (done) => {
            let user1 = new User({
                username: 'user1',
                email: 'user1@example.com',
                phone: '1234567890',
                password: 'password123',
                fullName: 'User One',
                birthdate: '1990-01-01',
                gender: 'male',
                securityQuestion1: 'Question 1',
                securityAnswer1: 'Answer 1',
                securityQuestion2: 'Question 2',
                securityAnswer2: 'Answer 2',
                securityQuestion3: 'Question 3',
                securityAnswer3: 'Answer 3'
            });
            user1.save((err, user1) => {
                chai.request(server)
                    .post('/api/users/invalidid/follow')
                    .set('Authorization', `Bearer ${user1.generateAuthToken()}`)
                    .send({ userId: user1._id })
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.have.property('message').eql('User not found.');
                        done();
                    });
            });
        });
    });

    describe('/POST/:id/unfollow unfollow user', () => {
        it('it should unfollow a user by the given id', (done) => {
            let user1 = new User({
                username: 'user1',
                email: 'user1@example.com',
                phone: '1234567890',
                password: 'password123',
                fullName: 'User One',
                birthdate: '1990-01-01',
                gender: 'male',
                securityQuestion1: 'Question 1',
                securityAnswer1: 'Answer 1',
                securityQuestion2: 'Question 2',
                securityAnswer2: 'Answer 2',
                securityQuestion3: 'Question 3',
                securityAnswer3: 'Answer 3'
            });
            let user2 = new User({
                username: 'user2',
                email: 'user2@example.com',
                phone: '0987654321',
                password: 'password123',
                fullName: 'User Two',
                birthdate: '1990-01-01',
                gender: 'female',
                securityQuestion1: 'Question 1',
                securityAnswer1: 'Answer 1',
                securityQuestion2: 'Question 2',
                securityAnswer2: 'Answer 2',
                securityQuestion3: 'Question 3',
                securityAnswer3: 'Answer 3'
            });
            user1.save((err, user1) => {
                user2.save((err, user2) => {
                    user1.following.push(user2._id);
                    user2.followers.push(user1._id);
                    user1.save((err, user1) => {
                        user2.save((err, user2) => {
                            chai.request(server)
                                .post(`/api/users/${user2._id}/unfollow`)
                                .set('Authorization', `Bearer ${user1.generateAuthToken()}`)
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

        it('it should return 404 for non-existent user', (done) => {
            let user1 = new User({
                username: 'user1',
                email: 'user1@example.com',
                phone: '1234567890',
                password: 'password123',
                fullName: 'User One',
                birthdate: '1990-01-01',
                gender: 'male',
                securityQuestion1: 'Question 1',
                securityAnswer1: 'Answer 1',
                securityQuestion2: 'Question 2',
                securityAnswer2: 'Answer 2',
                securityQuestion3: 'Question 3',
                securityAnswer3: 'Answer 3'
            });
            user1.save((err, user1) => {
                chai.request(server)
                    .post('/api/users/invalidid/unfollow')
                    .set('Authorization', `Bearer ${user1.generateAuthToken()}`)
                    .send({ userId: user1._id })
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.have.property('message').eql('User not found.');
                        done();
                    });
            });
        });
    });
});
