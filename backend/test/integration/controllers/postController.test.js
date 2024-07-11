import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';
import Post from '../../../models/Post.js';
import jwt from 'jsonwebtoken';

chai.use(chaiHttp);
const { expect } = chai;

describe('Post Controller Integration Tests', () => {
    let token, userId, postId;

    before(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});

        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        const savedUser = await user.save();
        userId = savedUser._id;
        token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const post = new Post({
            content: 'This is a test post',
            author: userId
        });
        const savedPost = await post.save();
        postId = savedPost._id;
    });

    after(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
    });

    describe('POST /posts', () => {
        it('should create a new post', (done) => {
            const post = {
                content: 'Another test post',
                author: userId
            };
            chai.request(server)
                .post('/posts')
                .set('Authorization', `Bearer ${token}`)
                .send(post)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message', 'Post created successfully');
                    expect(res.body.post).to.have.property('content', 'Another test post');
                    done();
                });
        });
    });

    describe('GET /posts', () => {
        it('should retrieve all posts', (done) => {
            chai.request(server)
                .get('/posts')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.posts).to.be.an('array');
                    done();
                });
        });
    });

    describe('PUT /posts/:id/like', () => {
        it('should like a post', (done) => {
            chai.request(server)
                .put(`/posts/${postId}/like`)
                .set('Authorization', `Bearer ${token}`)
                .send({ userId })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Like status updated successfully');
                    expect(res.body.post.likes).to.include(userId.toString());
                    done();
                });
        });
    });

    describe('POST /posts/:id/comment', () => {
        it('should comment on a post', (done) => {
            const comment = {
                userId,
                content: 'This is a test comment'
            };
            chai.request(server)
                .post(`/posts/${postId}/comment`)
                .set('Authorization', `Bearer ${token}`)
                .send(comment)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Comment added successfully');
                    expect(res.body.post.comments[0]).to.have.property('content', 'This is a test comment');
                    done();
                });
        });
    });

    describe('DELETE /posts/:id', () => {
        it('should delete a post', (done) => {
            chai.request(server)
                .delete(`/posts/${postId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Post deleted successfully');
                    done();
                });
        });
    });
});
