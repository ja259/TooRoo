import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import Post from '../../models/Post.js';
import User from '../../models/User.js';

const should = chai.should();
chai.use(chaiHttp);

describe('Post Routes', () => {

    before(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
    });

    after(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
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
                        done();
                    });
            });
        });
    });

    describe('/GET posts', () => {
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

    describe('/PUT/:id/like post', () => {
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
                        .put(`/api/posts/${post._id}/like`)
                        .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                        .send({ userId: user._id })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Like status updated successfully');
                            done();
                        });
                });
            });
        });
    });

    describe('/POST/:id/comment post', () => {
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
                            done();
                        });
                });
            });
        });
    });

    describe('/DELETE/:id post', () => {
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

    describe('/GET timeline-posts', () => {
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
                        .get('/api/posts/timeline-posts')
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

    describe('/GET you-all-videos', () => {
        it('it should get all videos', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                let post = new Post({
                    content: 'Test video',
                    author: user._id,
                    videoUrl: 'testfile.mp4'
                });
                post.save((err, post) => {
                    chai.request(server)
                        .get('/api/posts/you-all-videos')
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

    describe('/GET following-videos', () => {
        it('it should get following videos', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                following: []
            });
            let followedUser = new User({
                username: 'followeduser',
                email: 'followeduser@example.com',
                phone: '0987654321',
                password: 'password123'
            });
            followedUser.save((err, followedUser) => {
                user.following.push(followedUser._id);
                user.save((err, user) => {
                    let post = new Post({
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
    });
});
