import * as chai from 'chai';
import mongoose from 'mongoose';
import Video from '../../../models/Video.js';

const { expect } = chai;

describe('Video Model Tests', () => {
    before(async () => {
        await mongoose.connect('mongodb://localhost/testDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await Video.deleteMany();
    });

    after(async () => {
        await mongoose.connection.close();
    });

    it('should create a new video', async () => {
        const video = new Video({
            videoUrl: 'http://testurl.com/video.mp4',
            author: new mongoose.Types.ObjectId(),
            description: 'Test Video'
        });
        const savedVideo = await video.save();
        expect(savedVideo).to.have.property('_id');
        expect(savedVideo).to.have.property('videoUrl', 'http://testurl.com/video.mp4');
    });

    it('should require a videoUrl', async () => {
        const video = new Video({
            author: new mongoose.Types.ObjectId(),
            description: 'Test Video'
        });
        try {
            await video.save();
        } catch (error) {
            expect(error.errors.videoUrl).to.exist;
        }
    });

    it('should require an author', async () => {
        const video = new Video({
            videoUrl: 'http://testurl.com/video.mp4',
            description: 'Test Video'
        });
        try {
            await video.save();
        } catch (error) {
            expect(error.errors.author).to.exist;
        }
    });

    it('should add a like to a video', async () => {
        const video = new Video({
            videoUrl: 'http://testurl.com/video.mp4',
            author: new mongoose.Types.ObjectId(),
            description: 'Test Video'
        });
        const savedVideo = await video.save();
        savedVideo.likes.push(new mongoose.Types.ObjectId());
        const updatedVideo = await savedVideo.save();
        expect(updatedVideo.likes).to.have.lengthOf(1);
    });

    it('should add a comment to a video', async () => {
        const video = new Video({
            videoUrl: 'http://testurl.com/video.mp4',
            author: new mongoose.Types.ObjectId(),
            description: 'Test Video'
        });
        const savedVideo = await video.save();
        savedVideo.comments.push({ author: new mongoose.Types.ObjectId(), content: 'Test comment' });
        const updatedVideo = await savedVideo.save();
        expect(updatedVideo.comments).to.have.lengthOf(1);
    });

    it('should update a video description', async () => {
        const video = new Video({
            videoUrl: 'http://testurl.com/video.mp4',
            author: new mongoose.Types.ObjectId(),
            description: 'Test Video'
        });
        const savedVideo = await video.save();
        savedVideo.description = 'Updated Test Video';
        const updatedVideo = await savedVideo.save();
        expect(updatedVideo).to.have.property('description', 'Updated Test Video');
    });

    it('should delete a video', async () => {
        const video = new Video({
            videoUrl: 'http://testurl.com/video.mp4',
            author: new mongoose.Types.ObjectId(),
            description: 'Test Video'
        });
        const savedVideo = await video.save();
        await savedVideo.remove();
        const deletedVideo = await Video.findById(savedVideo._id);
        expect(deletedVideo).to.be.null;
    });
});
