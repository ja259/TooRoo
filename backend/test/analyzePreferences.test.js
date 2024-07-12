import * as chai from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Interaction from '../models/Interaction.js';
import Post from '../models/Post.js';
import analyzePreferences from '../analyzePreferences.js';
import { connectDB, disconnectDB } from '../db.js';

const { expect } = chai;

describe('Analyze Preferences Service Tests', () => {
    let interactionStub, postStub;

    before(async () => {
        await connectDB();
    });

    after(async () => {
        await disconnectDB();
    });

    beforeEach(() => {
        interactionStub = sinon.stub(Interaction, 'find');
        postStub = sinon.stub(Post, 'find').returns({
            populate: sinon.stub().returnsThis(),
            exec: sinon.stub().resolves([
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
            ])
        });
    });

    afterEach(() => {
        interactionStub.restore();
        postStub.restore();
    });

    it('should analyze user preferences correctly', async () => {
        const userId = 'userId';
        const interactions = [{ postId: 'postId1' }, { postId: 'postId2' }];
        interactionStub.withArgs({ userId }).resolves(interactions);

        const result = await analyzePreferences(userId);
        expect(result).to.be.an('object');
        expect(result.likes).to.be.an('array').with.lengthOf(1);
        expect(result.comments).to.be.an('array').with.lengthOf(1);
    });

    it('should handle no interactions found', async () => {
        interactionStub.resolves([]);

        const result = await analyzePreferences('nonexistentUserId');
        expect(result).to.be.an('object');
        expect(result.likes).to.be.an('array').that.is.empty;
        expect(result.comments).to.be.an('array').that.is.empty;
    });

    it('should handle errors during preference analysis', async () => {
        interactionStub.rejects(new Error('Analysis error'));

        try {
            await analyzePreferences('userId');
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.eql('Failed to analyze preferences');
        }
    });

    it('should throw an error if userId is not provided', async () => {
        try {
            await analyzePreferences();
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.eql('User ID is required');
        }
    });
});
