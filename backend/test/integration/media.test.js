import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import Video from '../../models/Video.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

chai.should();
chai.use(chaiHttp);

describe('Media Routes', () => {
    let token;
    let authorId;

    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await User.deleteMany({});
        await Video.deleteMany({});

        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
        });

        await user.save();
        token = user.generateAuthToken();
        authorId = user._id.toString();
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Video.deleteMany({});
    });

    describe('/POST upload video', () => {
        it('should upload a video', (done) => {
            chai.request(server)
                .post('/api/media/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('video', fs.readFileSync(path.join(__dirname, '../../test/media/testfile.mp4')), 'testfile.mp4')
                .field('authorId', authorId)
                .field('description', 'Test video')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('message').eql('Video uploaded successfully');
                    done();
                });
        });

        it('should not upload a video without file', (done) => {
            chai.request(server)
                .post('/api/media/upload')
                .set('Authorization', `Bearer ${token}`)
                .field('authorId', authorId)
                .field('description', 'Test video')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('No file provided');
                    done();
                });
        });

        it('should not upload a video with invalid author ID', (done) => {
            chai.request(server)
                .post('/api/media/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('video', fs.readFileSync(path.join(__dirname, '../../test/media/testfile.mp4')), 'testfile.mp4')
                .field('authorId', 'invalidauthorid')
                .field('description', 'Test video')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Invalid author ID');
                    done();
                });
        });
    });

    describe('/GET you-all-videos', () => {
        it('should get all videos', (done) => {
            const video = new Video({
                videoUrl: 'testfile.mp4',
                description: 'Test video',
                author: authorId,
            });
            video.save((err, video) => {
                chai.request(server)
                    .get('/api/media/you-all-videos')
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Videos retrieved successfully');
                        res.body.videos.should.be.a('array');
                        res.body.videos.length.should.be.eql(1);
                        done();
                    });
            });
        });

        it('should return 404 if no videos found', (done) => {
            chai.request(server)
                .get('/api/media/you-all-videos')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('No videos found');
                    done();
                });
        });
    });

    describe('/DELETE/:id video', () => {
        let videoId;

        beforeEach(async () => {
            const video = new Video({
                videoUrl: 'testfile.mp4',
                description: 'Test video',
                author: authorId,
            });
            await video.save();
            videoId = video._id.toString();
        });

        it('should delete a video', (done) => {
            chai.request(server)
                .delete(`/api/media/${videoId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Video deleted successfully');
                    done();
                });
        });

        it('should return 404 for non-existent video', (done) => {
            chai.request(server)
                .delete('/api/media/invalidid')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Invalid video ID');
                    done();
                });
        });
    });

    describe('/PUT/:id video', () => {
        let videoId;

        beforeEach(async () => {
            const video = new Video({
                videoUrl: 'testfile.mp4',
                description: 'Test video',
                author: authorId,
            });
            await video.save();
            videoId = video._id.toString();
        });

        it('should update a video description', (done) => {
            chai.request(server)
                .put(`/api/media/${videoId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ description: 'Updated description' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Video updated successfully');
                    res.body.video.should.have.property('description').eql('Updated description');
                    done();
                });
        });

        it('should return 404 for non-existent video', (done) => {
            chai.request(server)
                .put('/api/media/invalidid')
                .set('Authorization', `Bearer ${token}`)
                .send({ description: 'Updated description' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Invalid video ID');
                    done();
                });
        });
    });
});
