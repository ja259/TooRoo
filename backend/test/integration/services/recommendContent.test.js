import * as chai from 'chai';
import Post from '../../../models/Post.js';
import recommendContent from '../../../recommendContent.js';
import mongoose from 'mongoose';

chai.use(chaiHttp);
const { expect } = chai;

describe('Recommend Content Service Tests', () => {
    let userId;

    before(async () => {
        const post = new Post({
            content: 'Test post content',
            author: new mongoose.Types.ObjectId()
        });
        await post.save();
        userId = new mongoose.Types.ObjectId();
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
