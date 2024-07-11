import * as chai from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
import analyzePreferences from '../analyzePreferences.js';
import recommendContent from '../recommendContent.js';

chai.should();

describe('Recommend Content Service Tests', () => {
    let analyzePreferencesStub, postStub;

    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(() => {
        analyzePreferencesStub = sinon.stub(analyzePreferences);
        postStub = sinon.stub(Post, 'find');
    });

    afterEach(() => {
        analyzePreferencesStub.restore();
        postStub.restore();
    });

    it('should recommend content based on preferences', async () => {
        const userId = 'userId';
        const preferences = {
            likes: [{ _id: 'likedPostId' }],
            comments: [{ _id: 'commentedPostId' }]
        };
        const recommendedPosts = [
            {
                _id: 'recommendedPostId1',
                author: { _id: 'authorId1', username: 'author1', email: 'author1@example.com' }
            },
            {
                _id: 'recommendedPostId2',
                author: { _id: 'authorId2', username: 'author2', email: 'author2@example.com' }
            }
        ];

        analyzePreferencesStub.withArgs(userId).resolves(preferences);
        postStub.withArgs({
            _id: { $nin: ['likedPostId', 'commentedPostId'] }
        }).resolves(recommendedPosts);

        const result = await recommendContent(userId);
        result.should.be.an('array').with.lengthOf(2);
        result[0].should.have.property('_id').eql('recommendedPostId1');
        result[1].should.have.property('_id').eql('recommendedPostId2');
    });

    it('should handle no preferences found', async () => {
        analyzePreferencesStub.resolves({ likes: [], comments: [] });
        postStub.resolves([]);

        const result = await recommendContent('userId');
        result.should.be.an('array').that.is.empty;
    });

    it('should handle errors during content recommendation', async () => {
        analyzePreferencesStub.rejects(new Error('Analysis error'));

        try {
            await recommendContent('userId');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.eql('Failed to recommend content');
        }
    });
});
