const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Interaction = require('../models/Interaction.js');
const Post = require('../models/Post.js');
const analyzePreferences = require('../analyzePreferences.js');

const should = chai.should();

describe('Analyze Preferences Service Tests', () => {
    let interactionStub, postStub;

    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(() => {
        interactionStub = sinon.stub(Interaction, 'find');
        postStub = sinon.stub(Post, 'find');
    });

    afterEach(() => {
        interactionStub.restore();
        postStub.restore();
    });

    it('should analyze user preferences correctly', async () => {
        const userId = 'userId';
        const interactions = [{ postId: 'postId1' }, { postId: 'postId2' }];
        const posts = [
            {
                _id: 'postId1',
                likes: ['userId'],
                comments: [{ author: 'userId' }],
                author: { _id: 'authorId1', username: 'author1', email: 'author1@example.com' }
            },
            {
                _id: 'postId2',
                likes: [],
                comments: [{ author: 'anotherUserId' }],
                author: { _id: 'authorId2', username: 'author2', email: 'author2@example.com' }
            }
        ];

        interactionStub.withArgs({ userId }).resolves(interactions);
        postStub.withArgs({ _id: { $in: ['postId1', 'postId2'] } }).resolves(posts);

        const result = await analyzePreferences(userId);
        result.should.be.an('object');
        result.likes.should.be.an('array').with.lengthOf(1);
        result.comments.should.be.an('array').with.lengthOf(1);
    });

    it('should handle no interactions found', async () => {
        interactionStub.resolves([]);

        const result = await analyzePreferences('nonexistentUserId');
        result.should.be.an('object');
        result.likes.should.be.an('array').that.is.empty;
        result.comments.should.be.an('array').that.is.empty;
    });

    it('should handle errors during preference analysis', async () => {
        interactionStub.rejects(new Error('Analysis error'));

        try {
            await analyzePreferences('userId');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.eql('Failed to analyze preferences');
        }
    });
});
