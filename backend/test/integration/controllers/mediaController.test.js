import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';
import Video from '../../../models/Video.js';
import jwt from 'jsonwebtoken';
import path from 'path';

chai.use(chaiHttp);
const { expect } = chai;

describe('Media Controller Integration Tests', () => {
    let token, userId;

    before(async () => {
        await User.deleteMany({});
        await Video.deleteMany({});

        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        const savedUser = await user.save();
        userId = savedUser._id;
        token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    after(async () => {
        await User.deleteMany({});
        await Video.deleteMany({});
    });

    describe('POST /media/upload', () => {
        it('should upload a media file', (done) => {
            chai.request(server)
                .post('/media/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('file', path.resolve(__dirname, '../test-files/test-video.mp4'))
                .field('description', 'Test video')
                .field('authorId', userId.toString())
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message', 'Video uploaded successfully');
                    done();
                });
        });
    });

    describe('GET /media', () => {
        it('should retrieve all videos', (done) => {
            chai.request(server)
                .get('/media')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.videos).to.be.an('array');
                    done();
                });
        });
    });

    describe('DELETE /media/:id', () => {
        it('should delete a video', (done) => {
            const video = new Video({
                videoUrl: 'testfile.mp4',
                description: 'Test video',
                author: userId
            });
            video.save().then((savedVideo) => {
                chai.request(server)
                    .delete(`/media/${savedVideo._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message', 'Video deleted successfully');
                        done();
                    });
            });
        });
    });

    describe('PUT /media/:id', () => {
        it('should update a video description', (done) => {
            const video = new Video({
                videoUrl: 'testfile.mp4',
                description: 'Test video',
                author: userId
            });
            video.save().then((savedVideo) => {
                chai.request(server)
                    .put(`/media/${savedVideo._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ description: 'Updated description' })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body.video).to.have.property('description', 'Updated description');
                        done();
                    });
            });
        });
    });
});
