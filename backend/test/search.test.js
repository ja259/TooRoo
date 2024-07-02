const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const searchService = require('../services/searchService');
const should = chai.should();

describe('Search Service Tests', () => {
    let userStub, postStub;

    beforeEach(() => {
        userStub = sinon.stub(User, 'find');
        postStub = sinon.stub(Post, 'find');
    });

    afterEach(() => {
        userStub.restore();
        postStub.restore();
    });

    it('should search users by username', async () => {
        const query = 'username';
        const users = [{ _id: 'userId', username: 'username', avatar: 'avatarUrl' }];

        userStub.withArgs({ username: new RegExp(query, 'i') }).resolves(users);

        const result = await searchService.searchUsers(query);
        result.should.be.an('array').with.lengthOf(1);
        result[0].should.have.property('username').eql('username');
    });

    it('should search posts by content', async () => {
        const query = 'post content';
        const posts = [{
            _id: 'postId',
            content: 'post content',
            videoUrl: 'videoUrl',
            author: { _id: 'authorId', username: 'authorUsername', avatar: 'authorAvatarUrl' }
        }];

        postStub.withArgs({ content: new RegExp(query, 'i') }).resolves(posts);

        const result = await searchService.searchPosts(query);
        result.should.be.an('array').with.lengthOf(1);
        result[0].should.have.property('content').eql('post content');
    });

    it('should handle no results found', async () => {
        userStub.resolves([]);
        postStub.resolves([]);

        const userResult = await searchService.searchUsers('nonexistent');
        const postResult = await searchService.searchPosts('nonexistent');

        userResult.should.be.an('array').that.is.empty;
        postResult.should.be.an('array').that.is.empty;
    });

    it('should handle errors during search', async () => {
        userStub.rejects(new Error('Search error'));
        postStub.rejects(new Error('Search error'));

        try {
            await searchService.searchUsers('username');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.eql('Search error');
        }

        try {
            await searchService.searchPosts('post content');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.eql('Search error');
        }
    });
});
