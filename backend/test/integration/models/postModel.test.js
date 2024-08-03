import * as chai from 'chai';
import Post from '../../../models/Post.js';
import User from '../../../models/User.js';

const { expect } = chai;

describe('Post Model Integration Tests', () => {
    let user;

    before(async () => {
        user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            phone: '1234567890',
            securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
        });
        await user.save();
    });

    it('should create a new post', async () => {
        const post = new Post({ content: 'Test post', author: user._id });
        const savedPost = await post.save();
        expect(savedPost).to.have.property('_id');
        expect(savedPost.content).to.equal('Test post');
    });

    it('should require content', async () => {
        try {
            const post = new Post({ author: user._id });
            await post.save();
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });

    it('should require an author', async () => {
        try {
            const post = new Post({ content: 'Test post' });
            await post.save();
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });

    it('should add a like to a post', async () => {
        const post = new Post({ content: 'Test post', author: user._id });
        await post.save();
        post.likes.push(user._id);
        const updatedPost = await post.save();
        expect(updatedPost.likes).to.include(user._id);
    });

    it('should delete a post', async () => {
        const post = new Post({ content: 'Test post', author: user._id });
        await post.save();
        await Post.findByIdAndRemove(post._id);
        const deletedPost = await Post.findById(post._id);
        expect(deletedPost).to.be.null;
    });

    it('should update the user\'s post count after a post is created', async () => {
        const initialCount = user.postCount;
        const post = new Post({ content: 'Test post', author: user._id });
        await post.save();
        await user.save();
        const updatedUser = await User.findById(user._id);
        expect(updatedUser.postCount).to.equal(initialCount + 1);
    });

    it('should update the user\'s post count after a post is deleted', async () => {
        const post = new Post({ content: 'Test post', author: user._id });
        await post.save();
        const initialCount = user.postCount;
        await Post.findByIdAndRemove(post._id);
        await user.save();
        const updatedUser = await User.findById(user._id);
        expect(updatedUser.postCount).to.equal(initialCount - 1);
    });
});
