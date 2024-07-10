import * as chai from 'chai';
import mongoose from 'mongoose';
import Post from '../../../models/Post.js';
import User from '../../../models/User.js';
import dotenv from 'dotenv';

dotenv.config();
chai.should();

describe('Post Model', () => {
    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});
    });

    it('it should create a new post', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();

        const post = new Post({
            content: 'Test post',
            author: user._id
        });

        const savedPost = await post.save();
        savedPost.should.have.property('content').eql('Test post');
        savedPost.should.have.property('author').eql(user._id);
    });

    it('it should require content', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();

        const post = new Post({
            author: user._id
        });
        try {
            await post.save();
        } catch (error) {
            error.should.be.an('error');
            error.errors.should.have.property('content');
            error.errors.content.should.have.property('kind').eql('required');
        }
    });

    it('it should require an author', async () => {
        const post = new Post({
            content: 'Test post'
        });
        try {
            await post.save();
        } catch (error) {
            error.should.be.an('error');
            error.errors.should.have.property('author');
            error.errors.author.should.have.property('kind').eql('required');
        }
    });

    it('it should add a like to a post', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        const post = new Post({
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
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        const post = new Post({
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
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        const post = new Post({
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
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        const post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();
        await Post.findByIdAndRemove(post._id);
        const deletedPost = await Post.findById(post._id);
        should.not.exist(deletedPost);
    });

    it('it should update the user\'s post count after a post is created', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        const post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();
        const updatedUser = await User.findById(user._id);
        updatedUser.posts.should.include(post._id);
    });

    it('it should update the user\'s post count after a post is deleted', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        const post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();
        await Post.findByIdAndRemove(post._id);
        const updatedUser = await User.findById(user._id);
        updatedUser.posts.should.not.include(post._id);
    });
});
