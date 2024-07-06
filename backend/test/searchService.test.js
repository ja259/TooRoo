import * as chai from 'chai';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { searchUsers, searchPosts } from '../services/searchService.js';

chai.should();

describe('Search Service Tests', () => {
    let userStub, postStub;

    before(() => {
        mongoose.connect('mongodb://localhost:27017/testdb');
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
        const users = [{
            _id: 'userId',
            username: 'username',
            avatar: 'avatarUrl',
            bio: 'User bio',
            followers: ['followerId1', 'followerId2'],
            following: ['followingId1', 'followingId2'],
            posts: ['postId1', 'postId2']
        }];

        userStub.withArgs({ username: new RegExp(query, 'i') }).resolves(users);

        const result = await searchUsers(query);
        result.should.be.an('array').with.lengthOf(1);
        result[0].should.have.property('username').eql('username');
        result[0].should.have.property('avatar').eql('avatarUrl');
        result[0].should.have.property('bio').eql('User bio');
        result[0].should.have.property('followers').with.lengthOf(2);
        result[0].should.have.property('following').with.lengthOf(2);
        result[0].should.have.property('posts').with.lengthOf(2);
    });

    it('should search posts by content', async () => {
        const query = 'post content';
        const posts = [{
            _id: 'postId',
            content: 'post content',
            videoUrl: 'videoUrl',
            imageUrl: 'imageUrl',
            author: {
                _id: 'authorId',
                username: 'authorUsername',
                avatar: 'authorAvatarUrl'
            },
            likes: ['likeId1', 'likeId2'],
            comments: [{
                author: {
                    _id: 'commentAuthorId',
                    username: 'commentAuthorUsername',
                    avatar: 'commentAuthorAvatarUrl'
                },
                content: 'comment content'
            }]
        }];

        postStub.withArgs({ content: new RegExp(query, 'i') }).resolves(posts);

        const result = await searchPosts(query);
        result.should.be.an('array').with.lengthOf(1);
        result[0].should.have.property('content').eql('post content');
        result[0].should.have.property('videoUrl').eql('videoUrl');
        result[0].should.have.property('imageUrl').eql('imageUrl');
        result[0].should.have.property('author').which.is.an('object');
        result[0].author.should.have.property('username').eql('authorUsername');
        result[0].author.should.have.property('avatar').eql('authorAvatarUrl');
        result[0].should.have.property('likes').with.lengthOf(2);
        result[0].should.have.property('comments').with.lengthOf(1);
        result[0].comments[0].should.have.property('content').eql('comment content');
        result[0].comments[0].author.should.have.property('username').eql('commentAuthorUsername');
        result[0].comments[0].author.should.have.property('avatar').eql('commentAuthorAvatarUrl');
    });

    it('should handle no results found for users', async () => {
        userStub.resolves([]);

        const result = await searchUsers('nonexistent');
        result.should.be.an('array').that.is.empty;
    });

    it('should handle no results found for posts', async () => {
        postStub.resolves([]);

        const result = await searchPosts('nonexistent');
        result.should.be.an('array').that.is.empty;
    });

    it('should handle errors during user search', async () => {
        userStub.rejects(new Error('Search error'));

        try {
            await searchUsers('username');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.eql('Search error');
        }
    });

    it('should handle errors during post search', async () => {
        postStub.rejects(new Error('Search error'));

        try {
            await searchPosts('post content');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.eql('Search error');
        }
    });
});
