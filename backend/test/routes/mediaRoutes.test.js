import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';
import Video from '../../models/Video.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
chai.use(chaiHttp);
chai.should();

describe('Media Routes Tests', () => {

    before((done) => {
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => done())
            .catch(err => done(err));
    });

    after((done) => {
        mongoose.disconnect()
            .then(() => done())
            .catch(err => done(err));
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Video.deleteMany({});
    });

    let token = '';

    before((done) => {
        const user = new User({
            email: 'testuser@example.com',
            password: 'password123'
        });
        user.save((err, user) => {
            chai.request(server)
                .post('/api/auth/login')
                .send({ email: user.email, password: user.password })
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });
    });

    it('should upload a media file on /upload POST', (done) => {
        chai.request(server)
            .post('/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('video', 'test/media/testfile.mp4')
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Video uploaded successfully');
                done();
            });
    });

    it('should get all videos on /api/media/videos GET', (done) => {
        chai.request(server)
            .get('/api/media/videos')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.videos.should.be.a('array');
                done();
            });
    });

    it('should delete a video on /api/media/videos/:id DELETE', (done) => {
        const video = new Video({
            videoUrl: 'testfile.mp4',
            author: 'testuser'
        });
        video.save((err, video) => {
            chai.request(server)
                .delete(`/api/media/videos/${video._id}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Video deleted successfully');
                    done();
                });
        });
    });

    it('should update a video on /api/media/videos/:id PUT', (done) => {
        const video = new Video({
            videoUrl: 'testfile.mp4',
            author: 'testuser'
        });
        video.save((err, video) => {
            chai.request(server)
                .put(`/api/media/videos/${video._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ description: 'Updated description' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Video updated successfully');
                    done();
                });
        });
    });
});
