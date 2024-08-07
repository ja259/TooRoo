import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';
import User from '../../../models/User.js';
import Video from '../../../models/Video.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Video Model Tests', () => {
    let authToken, user;

    before(async () => {
        user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        authToken = user.generateAuthToken();
    });

    it('should create a new video', (done) => {
        const video = new Video({ videoUrl: 'http://example.com/video.mp4', author: user._id });
        video.save().then(() => {
            expect(video).to.have.property('_id');
            done();
        });
    });
});
