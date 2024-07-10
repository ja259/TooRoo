import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import Video from '../../../models/Video.js';
import User from '../../../models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
chai.should();
chai.use(chaiHttp);

describe('Media Controller', () => {
    let token;
    let userId;

    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.deleteMany({});
        await Video.deleteMany({});
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        await user.save();
        token = user.generateAuthToken();
        userId = user._id.toString();
    });

    after(async () => {
        await mongoose.connection.close();
    });

    describe('/POST upload video', () => {
        it('it should upload a video', (done) => {
            chai.request(server)
                .post('/api/media/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('video', 'test/media/testfile.mp4')
                .field('authorId', userId)
                .field('description', 'Test video')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('message').eql('Video uploaded successfully');
                    done();
                });
        });
    });

    describe('/GET you-all-videos', () => {
        it('it should get all videos', (done) => {
            chai.request(server)
                .get('/api/media/you-all-videos')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Videos retrieved successfully');
                    res.body.videos.should.be.a('array');
                    done();
                });
        });
    });

    describe('/DELETE/:id video', () => {
        let videoId;

        before(async () => {
            const video = new Video({
                videoUrl: 'testfile.mp4',
                description: 'Test video',
                author: userId
            });
            await video.save();
            videoId = video._id.toString();
        });

        it('it should delete a video', (done) => {
            chai.request(server)
                .delete(`/api/media/${videoId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Video deleted successfully');
                    done();
                });
        });

        it('it should return 404 for non-existent video', (done) => {
            chai.request(server)
                .delete('/api/media/invalidid')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('Video not found');
                    done();
                });
        });
    });

    describe('/PUT/:id video', () => {
        let videoId;

        before(async () => {
            const video = new Video({
                videoUrl: 'testfile.mp4',
                description: 'Test video',
                author: userId
            });
            await video.save();
            videoId = video._id.toString();
        });

        it('it should update a video description', (done) => {
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

        it('it should return 404 for non-existent video', (done) => {
            chai.request(server)
                .put('/api/media/invalidid')
                .set('Authorization', `Bearer ${token}`)
                .send({ description: 'Updated description' })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('Video not found');
                    done();
                });
        });
    });
});
