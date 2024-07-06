import dotenv from 'dotenv';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import server from '../server.js';
import User from '../../models/User.js';
import Post from '../../models/Post.js';
import Video from '../../models/Video.js';

dotenv.config();

chai.should();
chai.use(chaiHttp);

describe('TooRoo Backend Tests', () => {

    before((done) => {
        mongoose.connect(process.env.MONGODB_URI)
            .then(() => {
                console.log('Connected to MongoDB');
                done();
            })
            .catch(err => {
                console.error('MongoDB connection error:', err);
                done(err);
            });
    });

    after((done) => {
        mongoose.disconnect()
            .then(() => {
                console.log('Disconnected from MongoDB');
                done();
            })
            .catch(err => {
                console.error('MongoDB disconnection error:', err);
                done(err);
            });
    });

    describe('Auth Routes', () => {
        it('should register a user on /api/auth/register POST', (done) => {
            let user = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User registered successfully');
                    done();
                });
        });

        it('should login a user on /api/auth/login POST', (done) => {
            let user = {
                email: 'testuser@example.com',
                password: 'password123'
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });

        it('should send forgot password email on /api/auth/forgot-password POST', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/auth/forgot-password')
                    .send({ email: user.email })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Password reset token sent');
                        done();
                    });
            });
        });

        it('should reset password on /api/auth/reset-password/:token PUT', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/auth/forgot-password')
                    .send({ email: user.email })
                    .end((err, res) => {
                        chai.request(server)
                            .put(`/api/auth/reset-password/${res.body.token}`)
                            .send({ password: 'newpassword123' })
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.have.property('message').eql('Password has been reset successfully');
                                done();
                            });
                    });
            });
        });
    });

    describe('User Routes', () => {
        let token = '';

        before((done) => {
            let user = {
                email: 'testuser@example.com',
                password: 'password123'
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });

        it('should get user details on /api/users/:id GET', (done) => {
            chai.request(server)
                .get(`/api/users/testuser`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql('testuser');
                    done();
                });
        });

        it('should update user profile on /api/users/:id PUT', (done) => {
            let updateUser = {
                username: 'updateduser',
                bio: 'Updated bio'
            };
            chai.request(server)
                .put(`/api/users/testuser`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('User profile updated successfully.');
                    done();
                });
        });

        it('should follow a user on /api/users/:id/follow POST', (done) => {
            let followUser = new User({
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
            let unfollowUser = new User({
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

    describe('Post Routes', () => {
        let token = '';

        before((done) => {
            let user = {
                email: 'testuser@example.com',
                password: 'password123'
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });

        it('should create a post on /api/posts POST', (done) => {
            let post = {
                content: 'This is a test post'
            };
            chai.request(server)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send(post)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Post created successfully');
                    done();
                });
        });

        it('should get all posts on /api/posts GET', (done) => {
            chai.request(server)
                .get('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('should like a post on /api/posts/:id/like PUT', (done) => {
            let post = new Post({
                content: 'This is a test post',
                author: 'testuser'
            });
            post.save((err, post) => {
                chai.request(server)
                    .put(`/api/posts/${post._id}/like`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ userId: 'testuser' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Like status updated successfully');
                        done();
                    });
            });
        });

        it('should comment on a post on /api/posts/:id/comment POST', (done) => {
            let post = new Post({
                content: 'This is a test post',
                author: 'testuser'
            });
            post.save((err, post) => {
                chai.request(server)
                    .post(`/api/posts/${post._id}/comment`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ userId: 'testuser', content: 'This is a test comment' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Comment added successfully');
                        done();
                    });
            });
        });

        it('should delete a post on /api/posts/:id DELETE', (done) => {
            let post = new Post({
                content: 'This is a test post',
                author: 'testuser'
            });
            post.save((err, post) => {
                chai.request(server)
                    .delete(`/api/posts/${post._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Post deleted successfully');
                        done();
                    });
            });
        });

        it('should get timeline posts on /api/posts/timeline-posts GET', (done) => {
            chai.request(server)
                .get('/api/posts/timeline-posts')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('should get YouAll videos on /api/posts/you-all-videos GET', (done) => {
            chai.request(server)
                .get('/api/posts/you-all-videos')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('should get following videos on /api/posts/following-videos GET', (done) => {
            chai.request(server)
                .get('/api/posts/following-videos')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe('Media Routes', () => {
        let token = '';

        before((done) => {
            let user = {
                email: 'testuser@example.com',
                password: 'password123'
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });

        it('should upload a media file on /upload POST', (done) => {
            chai.request(server)
                .post('/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('file', 'test/media/testfile.jpg')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('File uploaded successfully');
                    done();
                });
        });

        it('should get all videos on /api/media/you-all-videos GET', (done) => {
            chai.request(server)
                .get('/api/media/you-all-videos')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });

        it('should delete a video on /api/media/:id DELETE', (done) => {
            let video = new Video({
                videoUrl: 'testfile.mp4',
                author: 'testuser'
            });
            video.save((err, video) => {
                chai.request(server)
                    .delete(`/api/media/${video._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Video deleted successfully');
                        done();
                    });
            });
        });

        it('should update a video on /api/media/:id PUT', (done) => {
            let video = new Video({
                videoUrl: 'testfile.mp4',
                author: 'testuser'
            });
            video.save((err, video) => {
                chai.request(server)
                    .put(`/api/media/${video._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ description: 'Updated description' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Video updated successfully');
                        done();
                    });
            });
        });
    });

    describe('Notification Routes', () => {
        it('should subscribe to push notifications on /subscribe POST', (done) => {
            let subscription = {
                endpoint: 'https://example.com/endpoint',
                keys: {
                    p256dh: 'BEXAMPLEKEY',
                    auth: 'AUTHKEY'
                }
            };
            chai.request(server)
                .post('/subscribe')
                .send(subscription)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    describe('Static Files', () => {
        it('should serve static files in production', (done) => {
            process.env.NODE_ENV = 'production';
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('Socket.io', () => {
        it('should handle socket connection', (done) => {
            const socket = require('socket.io-client')(`http://localhost:${server.address().port}`);
            socket.on('connect', () => {
                socket.emit('message', 'Test message');
                socket.on('message', (msg) => {
                    msg.should.eql('Test message');
                    socket.disconnect();
                    done();
                });
            });
        });
    });

});
