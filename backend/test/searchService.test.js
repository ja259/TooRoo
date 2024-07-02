const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const searchService = require('../services/searchService');
const should = chai.should();

describe('Search Service Tests', () => {
    let userStub, postStub;

    before(() => {
        mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(() => {
        mongoose.connection.close();
    });

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
        result[0].should.have.property('avatar').eql('avatarUrl');
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
        result[0].should.have.property('videoUrl').eql('videoUrl');
        result[0].should.have.property('author').which.is.an('object');
        result[0].author.should.have.property('username').eql('authorUsername');
        result[0].author.should.have.property('avatar').eql('authorAvatarUrl');
    });

    it('should handle no results found for users', async () => {
        userStub.resolves([]);

        const result = await searchService.searchUsers('nonexistent');
        result.should.be.an('array').that.is.empty;
    });

    it('should handle no results found for posts', async () => {
        postStub.resolves([]);

        const result = await searchService.searchPosts('nonexistent');
        result.should.be.an('array').that.is.empty;
    });

    it('should handle errors during user search', async () => {
        userStub.rejects(new Error('Search error'));

        try {
            await searchService.searchUsers('username');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.eql('Search error');
        }
    });

    it('should handle errors during post search', async () => {
        postStub.rejects(new Error('Search error'));

        try {
            await searchService.searchPosts('post content');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.eql('Search error');
        }
    });
});
