import * as chai from 'chai';
import Video from '../../../models/Video.js';

const { expect } = chai;

describe('Video Model Integration Tests', () => {
    it('should create a new video', async () => {
        const video = new Video({
            author: 'testUserId',
            url: 'http://testurl.com/video.mp4'
        });
        const savedVideo = await video.save();
        expect(savedVideo).to.have.property('_id');
        expect(savedVideo.author.toString()).to.equal('testUserId');
        expect(savedVideo.url).to.equal('http://testurl.com/video.mp4');
    });

    it('should not create a video without a required author', async () => {
        try {
            const video = new Video({
                url: 'http://testurl.com/video.mp4'
            });
            await video.save();
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });

    it('should not create a video without a required video URL', async () => {
        try {
            const video = new Video({
                author: 'testUserId'
            });
            await video.save();
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });

    it('should add a comment to a video', async () => {
        const video = new Video({
            author: 'testUserId',
            url: 'http://testurl.com/video.mp4'
        });
        await video.save();
        video.comments.push({
            author: 'testUserId',
            content: 'Test comment'
        });
        const updatedVideo = await video.save();
        expect(updatedVideo.comments[0].content).to.equal('Test comment');
    });

    it('should like a video', async () => {
        const video = new Video({
            author: 'testUserId',
            url: 'http://testurl.com/video.mp4'
        });
        await video.save();
        video.likes.push('testUserId');
        const updatedVideo = await video.save();
        expect(updatedVideo.likes).to.include('testUserId');
    });
});
