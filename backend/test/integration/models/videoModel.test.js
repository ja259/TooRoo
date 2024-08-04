import * as chai from 'chai';
import chaiHttp from 'chai-http';
import Video from '../../../models/Video.js';
import User from '../../../models/User.js';
import mongoose from 'mongoose';

chai.use(chaiHttp);
const { expect } = chai;

describe('Video Model Tests', () => {
    let userId;
    before(async () => {
        await User.deleteMany();
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        userId = user._id;
    });

    it('should create a new video', async () => {
        const video = new Video({
            videoUrl: 'http://example.com/video.mp4',
            description: 'Test video description',
            author: userId
        });
        const savedVideo = await video.save();
        expect(savedVideo).to.have.property('_id');
    });

    it('should require a videoUrl', async () => {
        try {
            const video = new Video({
                description: 'Test video description',
                author: userId
            });
            await video.save();
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it('should require an author', async () => {
        try {
            const video = new Video({
                videoUrl: 'http://example.com/video.mp4',
                description: 'Test video description'
            });
            await video.save();
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it('should add a like to a video', async () => {
        const video = new Video({
            videoUrl: 'http://example.com/video.mp4',
            description: 'Test video description',
            author: userId
        });
        await video.save();
        video.likes.push(userId);
        await video.save();
        expect(video.likes).to.include(userId);
    });

    it('should add a comment to a video', async () => {
        const video = new Video({
            videoUrl: 'http://example.com/video.mp4',
            description: 'Test video description',
            author: userId
        });
        await video.save();
        video.comments.push({ author: userId, content: 'Test comment' });
        await video.save();
        expect(video.comments).to.have.lengthOf(1);
    });

    it('should update a video description', async () => {
        const video = new Video({
            videoUrl: 'http://example.com/video.mp4',
            description: 'Test video description',
            author: userId
        });
        await video.save();
        video.description = 'Updated video description';
        await video.save();
        expect(video.description).to.equal('Updated video description');
    });

    it('should delete a video', async () => {
        const video = new Video({
            videoUrl: 'http://example.com/video.mp4',
            description: 'Test video description',
            author: userId
        });
        await video.save();
        await video.deleteOne();
        const foundVideo = await Video.findById(video._id);
        expect(foundVideo).to.be.null;
    });
});
