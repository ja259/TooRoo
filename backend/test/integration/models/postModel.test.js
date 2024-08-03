import { expect } from 'chai';
import Post from '../../../models/Post.js';
import User from '../../../models/User.js';
import mongoose from 'mongoose';

describe('Post Model Tests', () => {
    let userId;
    before(async () => {
        await User.deleteMany();
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        userId = user._id;
    });

    it('should create a new post', async () => {
        const post = new Post({
            content: 'Test post content',
            author: userId
        });
        const savedPost = await post.save();
        expect(savedPost).to.have.property('_id');
    });

    it('should require content', async () => {
        try {
            const post = new Post({
                author: userId
            });
            await post.save();
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it('should require an author', async () => {
        try {
            const post = new Post({
                content: 'Test post content'
            });
            await post.save();
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it('should add a like to a post', async () => {
        const post = new Post({
            content: 'Test post content',
            author: userId
        });
        await post.save();
        post.likes.push(userId);
        await post.save();
        expect(post.likes).to.include(userId);
    });

    it('should add a comment to a post', async () => {
        const post = new Post({
            content: 'Test post content',
            author: userId
        });
        await post.save();
        post.comments.push({ author: userId, content: 'Test comment' });
        await post.save();
        expect(post.comments).to.have.lengthOf(1);
    });

    it('should update a post content', async () => {
        const post = new Post({
            content: 'Test post content',
            author: userId
        });
        await post.save();
        post.content = 'Updated post content';
        await post.save();
        expect(post.content).to.equal('Updated post content');
    });

    it('should delete a post', async () => {
        const post = new Post({
            content: 'Test post content',
            author: userId
        });
        await post.save();
        await post.remove();
        const foundPost = await Post.findById(post._id);
        expect(foundPost).to.be.null;
    });
});
