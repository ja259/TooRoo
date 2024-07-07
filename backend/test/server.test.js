import * as chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import sinon from 'sinon';
import server from '../server.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Video from '../models/Video.js';
import { config as dotenvConfig } from 'dotenv';
import { connectDB, disconnectDB } from '../db.js';

chai.use(chaiHttp);
dotenvConfig({ path: './.env' });

const { expect } = chai;

describe('Server and Routes Tests', function () {
    this.timeout(10000);

    before(async () => {
        await connectDB();
    });

    after(async () => {
        await disconnectDB();
    });

    describe('Auth Routes', () => {
        beforeEach(async () => {
            await User.deleteMany({});
        });

        it('should register a user on /api/auth/register POST', (done) => {
            const user = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'User registered successfully');
                    done();
                });
        });

        it('should login a user on /api/auth/login POST', async () => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });
            await user.save();

            const res = await chai.request(server)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'password123' });

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('token');
        });

        it('should send forgot password email on /api/auth/forgot-password POST', (done) => {
            const email = 'testuser@example.com';
            chai.request(server)
                .post('/api/auth/forgot-password')
                .send({ email })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Password reset email sent');
                    done();
                });
        });

        it('should reset password on /api/auth/reset-password/:token PUT', async () => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });
            await user.save();

            // Mock password reset token
            const token = 'mocktoken';
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            await user.save();

            const res = await chai.request(server)
                .put(`/api/auth/reset-password/${token}`)
                .send({ password: 'newpassword123' });

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message', 'Password has been reset');
        });
    });

    describe('User Routes', () => {
        let token;

        before(async () => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });
            await user.save();

            const res = await chai.request(server)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'password123' });

            token = res.body.token;
        });

        it('should get user details on /api/users/:id GET', async () => {
            const user = await User.findOne({ email: 'testuser@example.com' });

            const res = await chai.request(server)
                .get(`/api/users/${user._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('username', 'testuser');
            expect(res.body).to.have.property('email', 'testuser@example.com');
        });

        it('should update user details on /api/users/:id PUT', async () => {
            const user = await User.findOne({ email: 'testuser@example.com' });

            const res = await chai.request(server)
                .put(`/api/users/${user._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'updateduser' });

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('username', 'updateduser');
        });

        it('should delete a user on /api/users/:id DELETE', async () => {
            const user = await User.findOne({ email: 'testuser@example.com' });

            const res = await chai.request(server)
                .delete(`/api/users/${user._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message', 'User deleted successfully');
        });
    });

    describe('Post Routes', () => {
        let token;
        let userId;

        before(async () => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });
            await user.save();
            userId = user._id;

            const res = await chai.request(server)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'password123' });

            token = res.body.token;
        });

        it('should create a post on /api/posts POST', (done) => {
            const post = {
                content: 'This is a test post',
                author: userId
            };
            chai.request(server)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send(post)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('content', 'This is a test post');
                    expect(res.body).to.have.property('author', userId.toString());
                    done();
                });
        });

        it('should get a post by ID on /api/posts/:id GET', async () => {
            const post = new Post({
                content: 'This is a test post',
                author: userId
            });
            await post.save();

            const res = await chai.request(server)
                .get(`/api/posts/${post._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('content', 'This is a test post');
        });

        it('should update a post on /api/posts/:id PUT', async () => {
            const post = new Post({
                content: 'This is a test post',
                author: userId
            });
            await post.save();

            const res = await chai.request(server)
                .put(`/api/posts/${post._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Updated post content' });

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('content', 'Updated post content');
        });

        it('should delete a post on /api/posts/:id DELETE', async () => {
            const post = new Post({
                content: 'This is a test post',
                author: userId
            });
            await post.save();

            const res = await chai.request(server)
                .delete(`/api/posts/${post._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message', 'Post deleted successfully');
        });
    });

    describe('Media Routes', () => {
        let token;
        let userId;

        before(async () => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });
            await user.save();
            userId = user._id;

            const res = await chai.request(server)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'password123' });

            token = res.body.token;
        });

        it('should upload a media file on /upload POST', (done) => {
            chai.request(server)
                .post('/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('file', Buffer.from('test file content'), 'test.txt')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'File uploaded successfully');
                    done();
                });
        });
    });

    describe('Notification Routes', () => {
        it('should subscribe to push notifications on /subscribe POST', (done) => {
            const subscription = {
                endpoint: 'https://fcm.googleapis.com/fcm/send/eF-p4BI4fMw:APA91bHvQyRGw8xLqCu_Vw4spmX',
                keys: {
                    p256dh: 'BOr8lCbyMO2A_XRKHkTl',
                    auth: '2G6e'
                }
            };
            chai.request(server)
                .post('/subscribe')
                .send(subscription)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });

    afterEach(async () => {
        sinon.restore();
    });
});
