import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import Post from '../../models/Post.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';

chai.should();
chai.use(chaiHttp);

describe('Post Routes', () => {
    let token;
    let userId;

    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await User.deleteMany({});
        await Post.deleteMany({});

        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        token = user.generateAuthToken();
        userId = user._id.toString();
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Post.deleteMany({});
    });

    describe('/POST create post', () => {
        it('it should create a post', (done) => {
            chai.request(server)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Test post', authorId: userId })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('message').eql('Post created successfully');
                    done();
                });
        });

        it('it should not create a post without content', (done) => {
            chai.request(server)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send({ authorId: userId })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Content and author ID are required.');
                    done();
                });
        });
    });

    describe('/GET posts', () => {
        it('it should get all posts', (done) => {
            const post = new Post({
                content: 'Test post',
                author: userId
            });
            post.save((err, post) => {
                chai.request(server)
                    .get('/api/posts')
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Posts retrieved successfully');
                        res.body.posts.should.be.a('array');
                        res.body.posts.length.should.be.eql(1);
                        done();
                    });
            });
        });

        it('it should return 404 if no posts found', (done) => {
            chai.request(server)
                .get('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('No posts found.');
                    done();
                });
        });
    });

    describe('/PUT/:id/like post', () => {
        let postId;

        beforeEach(async () => {
            const post = new Post({
                content: 'Test post',
                author: userId
            });
            await post.save();
            postId = post._id.toString();
        });

        it('it should like the post', (done) => {
            chai.request(server)
                .put(`/api/posts/${postId}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({ userId })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Like status updated successfully');
                    done();
                });
        });

        it('it should return 404 for non-existent post', (done) => {
            chai.request(server)
                .put('/api/posts/invalidid/like')
                .set('Authorization', `Bearer ${token}`)
                .send({ userId })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('Post not found.');
                    done();
                });
        });
    });

    describe('/POST/:id/comment post', () => {
        let postId;

        beforeEach(async () => {
            const post = new Post({
                content: 'Test post',
                author: userId
            });
            await post.save();
            postId = post._id.toString();
        });

        it('it should comment on the post', (done) => {
            const comment = {
                userId,
                content: 'Test comment'
            };
            chai.request(server)
                .post(`/api/posts/${postId}/comment`)
                .set('Authorization', `Bearer ${token}`)
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Comment added successfully');
                    done();
                });
        });

        it('it should return 404 for non-existent post', (done) => {
            const comment = {
                userId,
                content: 'Test comment'
            };
            chai.request(server)
                .post('/api/posts/invalidid/comment')
                .set('Authorization', `Bearer ${token}`)
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('Post not found.');
                    done();
                });
        });
    });

    describe('/DELETE/:id post', () => {
        let postId;

        beforeEach(async () => {
            const post = new Post({
                content: 'Test post',
                author: userId
            });
            await post.save();
            postId = post._id.toString();
        });

        it('it should delete the post', (done) => {
            chai.request(server)
                .delete(`/api/posts/${postId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Post deleted successfully');
                    done();
                });
        });

        it('it should return 404 for non-existent post', (done) => {
            chai.request(server)
                .delete('/api/posts/invalidid')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('Post not found');
                    done();
                });
        });
    });

    describe('/GET timeline-posts', () => {
        it('it should get timeline posts', (done) => {
            const post = new Post({
                content: 'Test post',
                author: userId
            });
            post.save((err, post) => {
                chai.request(server)
                    .get('/api/posts/timeline-posts')
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                        done();
                    });
            });
        });

        it('it should return 404 if no posts found', (done) => {
            chai.request(server)
                .get('/api/posts/timeline-posts')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('No posts found.');
                    done();
                });
        });
    });

    describe('/GET you-all-videos', () => {
        it('it should get all videos', (done) => {
            const post = new Post({
                content: 'Test video',
                author: userId,
                videoUrl: 'testfile.mp4'
            });
            post.save((err, post) => {
                chai.request(server)
                    .get('/api/posts/you-all-videos')
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                        done();
                    });
            });
        });

        it('it should return 404 if no videos found', (done) => {
            chai.request(server)
                .get('/api/posts/you-all-videos')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('No videos found.');
                    done();
                });
        });
    });

    describe('/GET following-videos', () => {
        it('it should get following videos', (done) => {
            const followedUser = new User({
                username: 'followeduser',
                email: 'followeduser@example.com',
                phone: '0987654321',
                password: 'password123'
            });
            followedUser.save((err, followedUser) => {
                const user = new User({
                    username: 'testuser',
                    email: 'testuser@example.com',
                    phone: '1234567890',
                    password: 'password123',
                    following: [followedUser._id]
                });
                user.save((err, user) => {
                    const post = new Post({
                        content: 'Test video',
                        author: followedUser._id,
                        videoUrl: 'testfile.mp4'
                    });
                    post.save((err, post) => {
                        chai.request(server)
                            .get('/api/posts/following-videos')
                            .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('array');
                                res.body.length.should.be.eql(1);
                                done();
                            });
                    });
                });
            });
        });

        it('it should return 404 if no following videos found', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                following: []
            });
            user.save((err, user) => {
                chai.request(server)
                    .get('/api/posts/following-videos')
                    .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.have.property('message').eql('No videos found.');
                        done();
                    });
            });
        });
    });
});
