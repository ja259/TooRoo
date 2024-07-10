import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import Post from '../../../models/Post.js';
import User from '../../../models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
chai.should();
chai.use(chaiHttp);

describe('Post Controller', () => {
    let token;
    let userId;

    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
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

    after(async () => {
        await mongoose.connection.close();
    });

    describe('/POST create post', () => {
        it('it should create a post', (done) => {
            const post = {
                content: 'Test post',
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

    describe('/GET posts', () => {
        it('it should get all posts', (done) => {
            chai.request(server)
                .get('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.posts.should.be.a('array');
                    done();
                });
        });
    });

    describe('/PUT/:id/like post', () => {
        let postId;

        before(async () => {
            const post = new Post({
                content: 'Test post',
                author: userId
            });
            await post.save();
            postId = post._id.toString();
        });

        it('it should like a post', (done) => {
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

    describe('/POST/:id/comment post', () => {
        let postId;

        before(async () => {
            const post = new Post({
                content: 'Test post',
                author: userId
            });
            await post.save();
            postId = post._id.toString();
        });

        it('it should comment on a post', (done) => {
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
    });

    describe('/DELETE/:id post', () => {
        let postId;

        before(async () => {
            const post = new Post({
                content: 'Test post',
                author: userId
            });
            await post.save();
            postId = post._id.toString();
        });

        it('it should delete a post', (done) => {
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
