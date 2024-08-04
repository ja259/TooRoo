import * as chai from 'chai';
import chaiHttp from 'chai-http';
import Interaction from '../../../models/Interaction.js';
import Post from '../../../models/Post.js';
import analyzePreferences from '../../../analyzePreferences.js';
import mongoose from 'mongoose';

chai.use(chaiHttp);
const { expect } = chai;

describe('Analyze Preferences Service Tests', () => {
    let userId;
    let postId;

    before(async () => {
        const post = new Post({
            content: 'Test post content',
            author: new mongoose.Types.ObjectId()
        });
        await post.save();
        postId = post._id;

        const interaction = new Interaction({
            userId: new mongoose.Types.ObjectId(),
            postId: postId,
            interactionType: 'like'
        });
        await interaction.save();
        userId = interaction.userId;
    });

    it('should analyze user preferences correctly', async () => {
        const preferences = await analyzePreferences(userId);
        expect(preferences).to.have.property('likes');
        expect(preferences).to.have.property('comments');
    });

    it('should handle no interactions found', async () => {
        const preferences = await analyzePreferences(new mongoose.Types.ObjectId());
        expect(preferences.likes).to.be.empty;
        expect(preferences.comments).to.be.empty;
    });

    it('should handle errors during preference analysis', async () => {
        try {
            await analyzePreferences(null);
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it('should throw an error if userId is not provided', async () => {
        try {
            await analyzePreferences(undefined);
        } catch (error) {
            expect(error.message).to.equal('User ID is required');
        }
    });
});
