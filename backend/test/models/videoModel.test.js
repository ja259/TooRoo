import chai from 'chai';
import mongoose from 'mongoose';
import Video from '../../models/Video.js';
import User from '../../models/User.js';

const should = chai.should();

describe('Video Model', () => {

    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Video.deleteMany({});
        await User.deleteMany({});
    });

    it('it should create a new video', (done) => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        user.save((err, user) => {
            let video = new Video({
                videoUrl: 'testfile.mp4',
                description: 'Test video',
                author: user._id
            });
            video.save((err, video) => {
                should.not.exist(err);
                video.should.have.property('videoUrl').eql('testfile.mp4');
                video.should.have.property('description').eql('Test video');
                video.should.have.property('author').eql(user._id);
                done();
            });
        });
    });

    it('it should not create a video without a required author', (done) => {
        let video = new Video({
            videoUrl: 'testfile.mp4',
            description: 'Test video'
        });
        video.save((err) => {
            should.exist(err);
            err.errors.should.have.property('author');
            err.errors.author.should.have.property('kind').eql('required');
            done();
        });
    });

    it('it should not create a video without a required video URL', (done) => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        user.save((err, user) => {
            let video = new Video({
                description: 'Test video',
                author: user._id
            });
            video.save((err) => {
                should.exist(err);
                err.errors.should.have.property('videoUrl');
                err.errors.videoUrl.should.have.property('kind').eql('required');
                done();
            });
        });
    });

    it('it should add a comment to a video', (done) => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        user.save((err, user) => {
            let video = new Video({
                videoUrl: 'testfile.mp4',
                description: 'Test video',
                author: user._id
            });
            video.save((err, video) => {
                should.not.exist(err);
                video.comments.push({
                    author: user._id,
                    content: 'Test comment'
                });
                video.save((err, updatedVideo) => {
                    should.not.exist(err);
                    updatedVideo.comments.should.have.lengthOf(1);
                    updatedVideo.comments[0].should.have.property('content').eql('Test comment');
                    done();
                });
            });
        });
    });

    it('it should like a video', (done) => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        user.save((err, user) => {
            let video = new Video({
                videoUrl: 'testfile.mp4',
                description: 'Test video',
                author: user._id
            });
            video.save((err, video) => {
                should.not.exist(err);
                video.likes.push(user._id);
                video.save((err, updatedVideo) => {
                    should.not.exist(err);
                    updatedVideo.likes.should.include(user._id);
                    done();
                });
            });
        });
    });

    // Add more tests for validation, methods, and hooks
});
