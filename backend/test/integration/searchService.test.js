import * as chai from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import { search } from '../../services/searchService.js'; // Adjust the import path as necessary
import Post from '../../models/Post.js';
import User from '../../models/User.js';
import { connectDB, disconnectDB } from '../../db.js'; // Adjust the import path as necessary

chai.should();
const { expect } = chai;

describe('Search Service Tests', () => {
    let userFindStub, postFindStub;

    before(async () => {
        await connectDB();
    });

    after(async () => {
        await disconnectDB();
    });

    beforeEach(() => {
        userFindStub = sinon.stub(User, 'find');
        postFindStub = sinon.stub(Post, 'find');
    });

    afterEach(() => {
        userFindStub.restore();
        postFindStub.restore();
    });

    it('should return users and posts matching the query', async () => {
        const query = 'test';
        const mockUsers = [{ username: 'testuser1' }, { username: 'testuser2' }];
        const mockPosts = [{ content: 'test post 1' }, { content: 'test post 2' }];

        userFindStub.withArgs({ username: new RegExp(query, 'i') }).resolves(mockUsers);
        postFindStub.withArgs({ content: new RegExp(query, 'i') }).resolves(mockPosts);

        const result = await search(query);
        result.should.be.an('object');
        result.users.should.deep.equal(mockUsers);
        result.posts.should.deep.equal(mockPosts);
    });

    it('should return empty arrays if no users or posts match the query', async () => {
        const query = 'nomatch';

        userFindStub.withArgs({ username: new RegExp(query, 'i') }).resolves([]);
        postFindStub.withArgs({ content: new RegExp(query, 'i') }).resolves([]);

        const result = await search(query);
        result.should.be.an('object');
        result.users.should.be.an('array').that.is.empty;
        result.posts.should.be.an('array').that.is.empty;
    });

    it('should throw an error if the search fails', async () => {
        const query = 'test';
        const errorMessage = 'Search failed';

        userFindStub.withArgs({ username: new RegExp(query, 'i') }).rejects(new Error(errorMessage));

        try {
            await search(query);
        } catch (error) {
            error.should.be.an('error');
            error.message.should.equal(errorMessage);
        }
    });
});
