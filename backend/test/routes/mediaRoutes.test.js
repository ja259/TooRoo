import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import Video from '../../models/Video.js';
import User from '../../models/User.js';

chai.should();
chai.use(chaiHttp);

describe('Media Routes', () => {

    before(async () => {
        await User.deleteMany({});
        await Video.deleteMany({});
    });

    after(async () => {
        await User.deleteMany({});
        await Video.deleteMany({});
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Video.deleteMany({});
    });

    describe('/POST upload video', () => {
        it('it should upload a video', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/media/upload')
                    .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                    .attach('video', 'test/media/testfile.mp4')
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.have.property('message').eql('Video uploaded successfully');
                        done();
                    });
            });
        });
    });

    describe('/GET you-all-videos', () => {
        it('it should get all videos', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                const video = new Video({
                    videoUrl: 'testfile.mp4',
                    description: 'Test video',
                    author: user._id
                });
                video.save((err, video) => {
                    chai.request(server)
                        .get('/api/media/you-all-videos')
                        .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Videos retrieved successfully');
                            res.body.videos.should.be.a('array');
                            res.body.videos.length.should.be.eql(1);
                            done();
                        });
                });
            });
        });
    });

    describe('/DELETE/:id video', () => {
        it('it should delete a video', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                const video = new Video({
                    videoUrl: 'testfile.mp4',
                    description: 'Test video',
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

        it('it should return 404 for non-existent video', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                chai.request(server)
                    .delete('/api/media/invalidid')
                    .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.have.property('message').eql('Video not found');
                        done();
                    });
            });
        });
    });

    describe('/PUT/:id video', () => {
        it('it should update a video description', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                const video = new Video({
                    videoUrl: 'testfile.mp4',
                    description: 'Test video',
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

        it('it should return 404 for non-existent video', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                chai.request(server)
                    .put('/api/media/invalidid')
                    .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                    .send({ description: 'Updated description' })
                    .end((err, res) => {
                        res.should.have.status(404);
                        res.body.should.have.property('message').eql('Video not found');
                        done();
                    });
            });
        });
    });
});
