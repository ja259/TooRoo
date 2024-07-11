import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';
import Video from '../../models/Video.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

chai.use(chaiHttp);
const { expect } = chai;

describe('Media Controller Tests', () => {
    let token, userId, videoId;

    before(async () => {
        await User.deleteMany({});
        await Video.deleteMany({});

        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        const savedUser = await user.save();
        userId = savedUser._id;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const video = new Video({
            videoUrl: 'testfile.mp4',
            description: 'Test video',
            author: userId
        });
        const savedVideo = await video.save();
        videoId = savedVideo._id;
    });

    after(async () => {
        await User.deleteMany({});
        await Video.deleteMany({});
    });

    describe('POST /api/media/upload', () => {
        it('should upload a media file', (done) => {
            chai.request(server)
                .post('/api/media/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('video', path.resolve(__dirname, '../test-files/test-video.mp4'))
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message', 'Video uploaded successfully');
                    done();
                });
        });
    });

    describe('GET /api/media', () => {
        it('should retrieve all videos', (done) => {
            chai.request(server)
                .get('/api/media')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.videos).to.be.an('array');
                    done();
                });
        });
    });

    describe('DELETE /api/media/:id', () => {
        it('should delete a video', (done) => {
            chai.request(server)
                .delete(`/api/media/${videoId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Video deleted successfully');
                    done();
                });
        });
    });

    describe('PUT /api/media/:id', () => {
        it('should update a video description', (done) => {
            const updatedDescription = { description: 'Updated description' };
            chai.request(server)
                .put(`/api/media/${videoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedDescription)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.video).to.have.property('description', 'Updated description');
                    done();
                });
        });
    });
});
