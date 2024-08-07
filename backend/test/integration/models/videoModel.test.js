import '../../setup.js';
import '../../teardown.js';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';
import User from '../../../models/User.js';
import Video from '../../../models/Video.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Video Model Tests', () => {
    let userToken;
    let userId;
    let videoId;

    before(async () => {
        await User.deleteMany({});
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: [
                { question: 'First pet?', answer: 'Fluffy' },
                { question: 'Mother\'s maiden name?', answer: 'Smith' },
                { question: 'Favorite color?', answer: 'Blue' }
            ]
        });
        await user.save();
        userToken = user.generateAuthToken();
        userId = user._id;
    });

    it('should create a new video', (done) => {
        const video = new Video({
            videoUrl: 'http://testvideo.com',
            author: userId,
            description: 'Test Video'
        });
        video.save()
            .then((savedVideo) => {
                videoId = savedVideo._id;
                done();
            })
            .catch((err) => done(err));
    });

    it('should add a comment to a video', (done) => {
        Video.findById(videoId)
            .then((video) => {
                video.comments.push({
                    author: userId,
                    content: 'Test comment'
                });
                return video.save();
            })
            .then(() => done())
            .catch((err) => done(err));
    });

    it('should delete a video', (done) => {
        Video.findByIdAndRemove(videoId)
            .then(() => done())
            .catch((err) => done(err));
    });
});
