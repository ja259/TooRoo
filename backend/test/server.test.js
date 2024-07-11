import * as chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import sinon from 'sinon';
import server from '../server.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Video from '../models/Video.js';
import { connectDB, disconnectDB } from '../db.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Server and Routes Tests', function () {
    this.timeout(20000);

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

        it('should update user profile on /api/users/:id PUT', async () => {
            const user = await User.findOne({ email: 'testuser@example.com' });
            const updatedData = {
                username: 'updateduser',
                bio: 'This is an updated bio',
                avatar: 'updated_avatar_url'
            };

            const res = await chai.request(server)
                .put(`/api/users/${user._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message', 'User profile updated successfully.');
            expect(res.body.user).to.have.property('username', 'updateduser');
            expect(res.body.user).to.have.property('bio', 'This is an updated bio');
            expect(res.body.user).to.have.property('avatar', 'updated_avatar_url');
        });
    });

    describe('Post Routes', () => {
        let token;
        let user;

        before(async () => {
            user = new User({
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

        it('should create a post on /api/posts POST', (done) => {
            const post = {
                content: 'This is a test post',
                authorId: user._id
            };

            chai.request(server)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send(post)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Post created successfully');
                    expect(res.body).to.have.property('post');
                    done();
                });
        });

        it('should retrieve posts on /api/posts GET', async () => {
            const res = await chai.request(server)
                .get('/api/posts')
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message', 'Posts retrieved successfully');
            expect(res.body.posts).to.be.an('array');
        });

        it('should like a post on /api/posts/:id/like PUT', async () => {
            const post = new Post({
                content: 'Test post',
                author: user._id
            });
            await post.save();

            const res = await chai.request(server)
                .put(`/api/posts/${post._id}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: user._id });

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message', 'Like status updated successfully');
            expect(res.body.post).to.have.property('likes').that.includes(user._id.toString());
        });

        it('should comment on a post on /api/posts/:id/comment POST', async () => {
            const post = new Post({
                content: 'Test post',
                author: user._id
            });
            await post.save();

            const comment = {
                userId: user._id,
                content: 'This is a test comment'
            };

            const res = await chai.request(server)
                .post(`/api/posts/${post._id}/comment`)
                .set('Authorization', `Bearer ${token}`)
                .send(comment);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message', 'Comment added successfully');
            expect(res.body.post.comments[0]).to.have.property('content', 'This is a test comment');
        });
    });

    describe('Media Routes', () => {
        let token;
        let user;

        before(async () => {
            user = new User({
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

        it('should upload a media file on /api/media/upload POST', (done) => {
            chai.request(server)
                .post('/api/media/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('file', 'test/test-files/test-video.mp4')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'File uploaded successfully');
                    expect(res.body).to.have.property('fileName');
                    done();
                });
        });

        it('should retrieve all videos on /api/media GET', async () => {
            const res = await chai.request(server)
                .get('/api/media')
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message', 'Videos retrieved successfully');
            expect(res.body.videos).to.be.an('array');
        });

        it('should delete a video on /api/media/:id DELETE', async () => {
            const video = new Video({
                videoUrl: 'test-video.mp4',
                description: 'Test video',
                author: user._id
            });
            await video.save();

            const res = await chai.request(server)
                .delete(`/api/media/${video._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message', 'Video deleted successfully');
        });
    });

    afterEach(async () => {
        sinon.restore();
    });
});
