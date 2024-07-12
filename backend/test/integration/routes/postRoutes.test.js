import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';
import Post from '../../../models/Post.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
chai.use(chaiHttp);
chai.should();

describe('Post Routes Integration Tests', () => {

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
        await Post.deleteMany({});
    });

    let token = '';

    before((done) => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
        });
        user.save((err, user) => {
            chai.request(server)
                .post('/api/auth/login')
                .send({ emailOrPhone: 'testuser@example.com', password: 'password123' })
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });
    });

    it('should create a post on /api/posts POST', (done) => {
        const post = {
            content: 'This is a test post',
            authorId: mongoose.Types.ObjectId()
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
                res.body.posts.should.be.a('array');
                done();
            });
    });

    it('should like a post on /api/posts/:id/like PUT', (done) => {
        const post = new Post({
            content: 'This is a test post',
            author: mongoose.Types.ObjectId()
        });
        post.save((err, post) => {
            chai.request(server)
                .put(`/api/posts/${post._id}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: mongoose.Types.ObjectId() })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Like status updated successfully');
                    done();
                });
        });
    });

    it('should comment on a post on /api/posts/:id/comment POST', (done) => {
        const post = new Post({
            content: 'This is a test post',
            author: mongoose.Types.ObjectId()
        });
        post.save((err, post) => {
            chai.request(server)
                .post(`/api/posts/${post._id}/comment`)
                .set('Authorization', `Bearer ${token}`)
                .send({ userId: mongoose.Types.ObjectId(), content: 'This is a test comment' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Comment added successfully');
                    done();
                });
        });
    });

    it('should delete a post on /api/posts/:id DELETE', (done) => {
        const post = new Post({
            content: 'This is a test post',
            author: mongoose.Types.ObjectId()
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
