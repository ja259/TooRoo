import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';
import Post from '../../models/Post.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
chai.use(chaiHttp);
chai.should();

describe('Post Routes Tests', () => {

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

    it('should create a post on /api/posts POST', (done) => {
        const post = {
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
                res.body.posts.should.be.a('array');
                done();
            });
    });

    it('should like a post on /api/posts/:id/like PUT', (done) => {
        const post = new Post({
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
        const post = new Post({
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
        const post = new Post({
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
