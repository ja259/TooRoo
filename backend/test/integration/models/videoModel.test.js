import * as chai from 'chai';
import mongoose from 'mongoose';
import Video from '../../../models/Video.js';
import User from '../../../models/User.js';
import dotenv from 'dotenv';

dotenv.config();
chai.should();

describe('Video Model Integration Tests', () => {

    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Video.deleteMany({});
        await User.deleteMany({});
    });

    it('should create a new video', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();

        const video = new Video({
            videoUrl: 'testfile.mp4',
            description: 'Test video',
            author: user._id
        });

        const savedVideo = await video.save();
        savedVideo.should.have.property('videoUrl').eql('testfile.mp4');
        savedVideo.should.have.property('description').eql('Test video');
        savedVideo.should.have.property('author').eql(user._id);
    });

    it('should not create a video without a required author', async () => {
        const video = new Video({
            videoUrl: 'testfile.mp4',
            description: 'Test video'
        });
        try {
            await video.save();
        } catch (error) {
            error.should.be.an('error');
            error.errors.should.have.property('author');
            error.errors.author.should.have.property('kind').eql('required');
        }
    });

    it('should not create a video without a required video URL', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();

        const video = new Video({
            description: 'Test video',
            author: user._id
        });
        try {
            await video.save();
        } catch (error) {
            error.should.be.an('error');
            error.errors.should.have.property('videoUrl');
            error.errors.videoUrl.should.have.property('kind').eql('required');
        }
    });

    it('should add a comment to a video', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();

        const video = new Video({
            videoUrl: 'testfile.mp4',
            description: 'Test video',
            author: user._id
        });
        await video.save();

        const comment = {
            author: user._id,
            content: 'Test comment'
        };
        video.comments.push(comment);
        await video.save();

        const updatedVideo = await Video.findById(video._id).populate('comments.author');
        updatedVideo.comments[0].content.should.eql('Test comment');
        updatedVideo.comments[0].author.username.should.eql('testuser');
    });

    it('should like a video', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();

        const video = new Video({
            videoUrl: 'testfile.mp4',
            description: 'Test video',
            author: user._id
        });
        await video.save();

        video.likes.push(user._id);
        await video.save();

        const updatedVideo = await Video.findById(video._id);
        updatedVideo.likes.should.include(user._id);
    });

    // Add more tests for validation, methods, and hooks
});
