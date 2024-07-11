import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';
import User from '../models/User.js';
import Video from '../models/Video.js';
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
        let user = {
            email: 'testuser@example.com',
            password: 'password123'
        };
        chai.request(server)
            .post('/api/auth/login')
            .send(user)
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    it('should upload a media file on /upload POST', (done) => {
        chai.request(server)
            .post('/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', 'test/media/testfile.jpg')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('File uploaded successfully');
                done();
            });
    });

    it('should get all videos on /api/media/you-all-videos GET', (done) => {
        chai.request(server)
            .get('/api/media/you-all-videos')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    it('should delete a video on /api/media/:id DELETE', (done) => {
        let video = new Video({
            videoUrl: 'testfile.mp4',
            author: 'testuser'
        });
        video.save((err, video) => {
            chai.request(server)
                .delete(`/api/media/${video._id}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Video deleted successfully');
                    done();
                });
        });
    });

    it('should update a video on /api/media/:id PUT', (done) => {
        let video = new Video({
            videoUrl: 'testfile.mp4',
            author: 'testuser'
        });
        video.save((err, video) => {
            chai.request(server)
                .put(`/api/media/${video._id}`)
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
