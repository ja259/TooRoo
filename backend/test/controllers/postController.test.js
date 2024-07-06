import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';
import Post from '../../models/Post.js';

const should = chai.should();
chai.use(chaiHttp);

describe('Post Controller', () => {
    let token;
    let userId;

    before(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        await user.save();
        token = user.generateAuthToken();
        userId = user._id.toString();
    });

    describe('POST /api/posts', () => {
        it('should create a new post', (done) => {
            const post = {
                content: 'This is a test post',
                authorId: userId
            };
            chai.request(server)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send(post)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('message').eql('Post created successfully');
                    done();
                });
        });
    });

    describe('GET /api/posts', () => {
        it('should get all posts', (done) => {
            chai.request(server)
                .get('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Posts retrieved successfully');
                    res.body.posts.should.be.a('array');
                    done();
                });
        });
    });

    describe('PUT /api/posts/:id/like', () => {
        let postId;

        before(async () => {
            const post = new Post({
                content: 'This is a test post',
                author: userId
            });
            await post.save();
            postId = post._id.toString();
        });

        it('should like the post', (done) => {
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
    });

    describe('POST /api/posts/:id/comment', () => {
        let postId;

        before(async () => {
            const post = new Post({
                content: 'This is a test post',
                author: userId
            });
            await post.save();
            postId = post._id.toString();
        });

        it('should comment on the post', (done) => {
            const comment = {
                userId,
                content: 'This is a test comment'
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
    });

    describe('DELETE /api/posts/:id', () => {
        let postId;

        before(async () => {
            const post = new Post({
                content: 'This is a test post',
                author: userId
            });
            await post.save();
            postId = post._id.toString();
        });

        it('should delete the post', (done) => {
            chai.request(server)
                .delete(`/api/posts/${postId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Post deleted successfully');
                    done();
                });
        });
    });
});
