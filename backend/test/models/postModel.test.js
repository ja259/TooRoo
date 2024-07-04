import chai from 'chai';
import mongoose from 'mongoose';
import Post from '../../models/Post.js';
import User from '../../models/User.js';

const should = chai.should();

describe('Post Model', () => {

    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});
    });

    it('it should create a new post', (done) => {
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
                should.not.exist(err);
                post.should.have.property('content').eql('Test post');
                post.should.have.property('author').eql(user._id);
                done();
            });
        });
    });

    it('it should require content', (done) => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        user.save((err, user) => {
            let post = new Post({
                author: user._id
            });
            post.save((err) => {
                should.exist(err);
                err.errors.should.have.property('content');
                err.errors.content.should.have.property('kind').eql('required');
                done();
            });
        });
    });

    it('it should require an author', (done) => {
        let post = new Post({
            content: 'Test post'
        });
        post.save((err) => {
            should.exist(err);
            err.errors.should.have.property('author');
            err.errors.author.should.have.property('kind').eql('required');
            done();
        });
    });

    it('it should add a like to a post', async () => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        let post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();
        post.likes.push(user._id);
        await post.save();
        const updatedPost = await Post.findById(post._id);
        updatedPost.likes.should.include(user._id);
    });

    it('it should add a comment to a post', async () => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        let post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();
        const comment = {
            author: user._id,
            content: 'Test comment'
        };
        post.comments.push(comment);
        await post.save();
        const updatedPost = await Post.findById(post._id).populate('comments.author');
        updatedPost.comments[0].content.should.eql('Test comment');
        updatedPost.comments[0].author.username.should.eql('testuser');
    });

    it('it should update a post content', async () => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        let post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();
        post.content = 'Updated test post';
        await post.save();
        const updatedPost = await Post.findById(post._id);
        updatedPost.content.should.eql('Updated test post');
    });

    it('it should delete a post', async () => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        let post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();
        await Post.findByIdAndRemove(post._id);
        const deletedPost = await Post.findById(post._id);
        should.not.exist(deletedPost);
    });

    // Add tests for hooks
    it('it should update the user\'s post count after a post is created', async () => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        let post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();
        const updatedUser = await User.findById(user._id);
        updatedUser.posts.should.include(post._id);
    });

    it('it should update the user\'s post count after a post is deleted', async () => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        let post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();
        await Post.findByIdAndRemove(post._id);
        const updatedUser = await User.findById(user._id);
        updatedUser.posts.should.not.include(post._id);
    });
});
