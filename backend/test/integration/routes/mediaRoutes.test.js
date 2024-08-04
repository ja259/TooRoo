import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';
import User from '../../../models/User.js';
import Video from '../../../models/Video.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Media Routes Tests', () => {
    let userToken;
    let userId;
    let videoId;

    before(async () => {
        await User.deleteMany();
        await Video.deleteMany();

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

    it('should upload a media file', (done) => {
        chai.request(app)
            .post('/api/media/upload')
            .set('Authorization', `Bearer ${userToken}`)
            .field('authorId', userId.toString())
            .field('description', 'Test Video')
            .attach('video', 'test/test-files/testvideo.mp4', 'testvideo.mp4')
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'Video uploaded successfully');
                videoId = res.body.video._id;
                done();
            });
    });

    it('should get all videos', (done) => {
        chai.request(app)
            .get('/api/media/videos')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Videos retrieved successfully');
                done();
            });
    });

    it('should delete a video', (done) => {
        chai.request(app)
            .delete(`/api/media/videos/${videoId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Video deleted successfully');
                done();
            });
    });

    it('should update a video', (done) => {
        chai.request(app)
            .put(`/api/media/videos/${videoId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ description: 'Updated Test Video' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Video updated successfully');
                done();
            });
    });
});
