import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import Video from '../../models/Video.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const { should } = chai;
should();
chai.use(chaiHttp);

describe('Media Controller', () => {

    beforeEach(async () => {
        await Video.deleteMany({});
        await User.deleteMany({});
    });

    describe('/POST upload video', () => {
        it('it should upload a video', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/media/upload')
                    .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                    .attach('video', fs.readFileSync(path.join(__dirname, 'testfile.mp4')), 'testfile.mp4')
                    .field('description', 'Test video description')
                    .field('authorId', user._id.toString())
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.have.property('message').eql('Video uploaded successfully');
                        res.body.video.should.have.property('videoUrl');
                        res.body.video.should.have.property('description').eql('Test video description');
                        res.body.video.should.have.property('author').eql(user._id.toString());
                        done();
                    });
            });
        });
    });

    describe('/GET get all videos', () => {
        it('it should get all videos', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                let video = new Video({
                    videoUrl: 'testfile.mp4',
                    description: 'Test video description',
                    author: user._id
                });
                video.save((err, video) => {
                    chai.request(server)
                        .get('/api/media')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Videos retrieved successfully');
                            res.body.videos.should.be.a('array');
                            res.body.videos.length.should.be.eql(1);
                            res.body.videos[0].should.have.property('videoUrl').eql('testfile.mp4');
                            res.body.videos[0].should.have.property('description').eql('Test video description');
                            res.body.videos[0].should.have.property('author').which.is.an('object');
                            res.body.videos[0].author.should.have.property('username').eql('testuser');
                            done();
                        });
                });
            });
        });
    });

    describe('/DELETE/:id delete video', () => {
        it('it should delete a video', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                let video = new Video({
                    videoUrl: 'testfile.mp4',
                    description: 'Test video description',
                    author: user._id
                });
                video.save((err, video) => {
                    chai.request(server)
                        .delete(`/api/media/${video._id}`)
                        .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Video deleted successfully');
                            done();
                        });
                });
            });
        });
    });

    describe('/PUT/:id update video', () => {
        it('it should update a video description', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                let video = new Video({
                    videoUrl: 'testfile.mp4',
                    description: 'Initial description',
                    author: user._id
                });
                video.save((err, video) => {
                    chai.request(server)
                        .put(`/api/media/${video._id}`)
                        .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                        .send({ description: 'Updated description' })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Video updated successfully');
                            res.body.video.should.have.property('description').eql('Updated description');
                            done();
                        });
                });
            });
        });
    });
});
