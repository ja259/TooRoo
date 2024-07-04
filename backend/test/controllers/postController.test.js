import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import Post from '../../models/Post.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';

const { should } = chai;
should();
chai.use(chaiHttp);

describe('Post Controller', () => {

    beforeEach(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});
    });

    describe('/POST create post', () => {
        it('it should create a post', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/posts')
                    .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                    .send({ content: 'Test post', authorId: user._id })
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.have.property('message').eql('Post created successfully');
                        res.body.post.should.have.property('content').eql('Test post');
                        res.body.post.should.have.property('author').eql(user._id.toString());
                        done();
                    });
            });
        });
    });

    describe('/GET get all posts', () => {
        it('it should get all posts', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                let post = new Post({
                    content: 'Test post',
                    author: user._id
                });
                post.save((err, post) => {
                    chai.request(server)
                        .get('/api/posts')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Posts retrieved successfully');
                            res.body.posts.should.be.a('array');
                            res.body.posts.length.should.be.eql(1);
                            res.body.posts[0].should.have.property('content').eql('Test post');
                            res.body.posts[0].should.have.property('author').which.is.an('object');
                            res.body.posts[0].author.should.have.property('username').eql('testuser');
                            done();
                        });
                });
            });
        });
    });

    describe('/GET get timeline posts', () => {
        it('it should get timeline posts', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                let post = new Post({
                    content: 'Test post',
                    author: user._id
                });
                post.save((err, post) => {
                    chai.request(server)
                        .get('/api/posts/timeline')
                        .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(1);
                            res.body[0].should.have.property('content').eql('Test post');
                            res.body[0].should.have.property('author').which.is.an('object');
                            res.body[0].author.should.have.property('username').eql('testuser');
                            done();
                        });
                });
            });
        });
    });

    describe('/GET get You All videos', () => {
        it('it should get You All videos', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                let post = new Post({
                    content: 'Test video post',
                    videoUrl: 'testvideo.mp4',
                    author: user._id
                });
                post.save((err, post) => {
                    chai.request(server)
                        .get('/api/posts/youallvideos')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(1);
                            res.body[0].should.have.property('videoUrl').eql('testvideo.mp4');
                            res.body[0].should.have.property('author').which.is.an('object');
                            res.body[0].author.should.have.property('username').eql('testuser');
                            done();
                        });
                });
            });
        });
    });

    describe('/GET get following videos', () => {
        it('it should get following videos', (done) => {
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
                    user1.save((err, user1) => {
                        let post = new Post({
                            content: 'Test video post by user2',
                            videoUrl: 'testvideo.mp4',
                            author: user2._id
                        });
                        post.save((err, post) => {
                            chai.request(server)
                                .get('/api/posts/followingvideos')
                                .set('Authorization', `Bearer ${user1.generateAuthToken()}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('array');
                                    res.body.length.should.be.eql(1);
                                    res.body[0].should.have.property('videoUrl').eql('testvideo.mp4');
                                    res.body[0].should.have.property('author').which.is.an('object');
                                    res.body[0].author.should.have.property('username').eql('user2');
                                    done();
                                });
                        });
                    });
                });
            });
        });
    });

    describe('/POST like post', () => {
        it('it should like a post', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                let post = new Post({
                    content: 'Test post',
                    author: user._id
                });
                post.save((err, post) => {
                    chai.request(server)
                        .post(`/api/posts/${post._id}/like`)
                        .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                        .send({ userId: user._id })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Like status updated successfully');
                            res.body.post.should.have.property('likes').which.is.an('array').that.includes(user._id.toString());
                            done();
                        });
                });
            });
        });
    });

    describe('/POST comment on post', () => {
        it('it should comment on a post', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                let post = new Post({
                    content: 'Test post',
                    author: user._id
                });
                post.save((err, post) => {
                    chai.request(server)
                        .post(`/api/posts/${post._id}/comment`)
                        .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                        .send({ userId: user._id, content: 'Test comment' })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Comment added successfully');
                            res.body.post.should.have.property('comments').which.is.an('array').with.lengthOf(1);
                            res.body.post.comments[0].should.have.property('content').eql('Test comment');
                            res.body.post.comments[0].should.have.property('author').eql(user._id.toString());
                            done();
                        });
                });
            });
        });
    });

    describe('/DELETE/:id delete post', () => {
        it('it should delete a post', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                let post = new Post({
                    content: 'Test post',
                    author: user._id
                });
                post.save((err, post) => {
                    chai.request(server)
                        .delete(`/api/posts/${post._id}`)
                        .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Post deleted successfully');
                            done();
                        });
                });
            });
        });
    });
});
