import * as chai from 'chai';
import sinon from 'sinon';
import searchService from '../../services/searchService.js';
import Post from '../../../models/Post.js';
import Video from '../../../models/Video.js';
import User from '../../../models/User.js';

const { expect } = chai;

describe('Search Service Tests', () => {
    let postStub, videoStub, userStub;

    beforeEach(() => {
        postStub = sinon.stub(Post, 'find');
        videoStub = sinon.stub(Video, 'find');
        userStub = sinon.stub(User, 'find');
    });

    afterEach(() => {
        postStub.restore();
        videoStub.restore();
        userStub.restore();
    });

    it('should search posts', async () => {
        const mockPosts = [{ content: 'Test post' }];
        postStub.resolves(mockPosts);

        const results = await searchService.searchPosts('test');
        expect(results).to.eql(mockPosts);
        postStub.calledOnce.should.be.true;
    });

    it('should search videos', async () => {
        const mockVideos = [{ videoUrl: 'test-video.mp4' }];
        videoStub.resolves(mockVideos);

        const results = await searchService.searchVideos('test');
        expect(results).to.eql(mockVideos);
        videoStub.calledOnce.should.be.true;
    });

    it('should search users', async () => {
        const mockUsers = [{ username: 'testuser' }];
        userStub.resolves(mockUsers);

        const results = await searchService.searchUsers('test');
        expect(results).to.eql(mockUsers);
        userStub.calledOnce.should.be.true;
    });
});
