import { expect } from 'chai';
import Post from '../../../models/Post.js';
import recommendContent from '../../../recommendContent.js';

describe('Recommend Content Service Tests', () => {
    let userId;

    before(async () => {
        const post = new Post({
            content: 'Test post content',
            author: 'author_id'
        });
        await post.save();
        userId = 'user_id';
    });

    it('should recommend content for a user', async () => {
        const recommendedPosts = await recommendContent(userId);
        expect(recommendedPosts).to.be.an('array');
    });

    it('should handle errors during content recommendation', async () => {
        try {
            await recommendContent(null);
        } catch (error) {
            expect(error).to.exist;
        }
    });
});
