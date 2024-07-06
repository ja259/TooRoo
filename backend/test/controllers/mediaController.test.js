import { should } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import Video from '../../models/Video.js';
import User from '../../models/User.js';

should();
chai.use(chaiHttp);

describe('Media Controller', () => {
    let token;
    let authorId;

    before(async () => {
        await User.deleteMany({});
        await Video.deleteMany({});
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        await user.save();
        token = user.generateAuthToken();
        authorId = user._id.toString();
    });

    describe('POST /api/media/upload', () => {
        it('should upload a new video', (done) => {
            chai.request(server)
                .post('/api/media/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('video', './test/test-video.mp4')
                .field('authorId', authorId)
                .field('description', 'Test video')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('message').eql('Video uploaded successfully');
                    done();
                });
        });
    });

    describe('GET /api/media/you-all-videos', () => {
        it('should get all videos', (done) => {
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

    describe('DELETE /api/media/:id', () => {
        let videoId;

        before(async () => {
            const video = new Video({
                videoUrl: 'test-video.mp4',
                description: 'Test video',
                author: authorId
            });
            await video.save();
            videoId = video._id.toString();
        });

        it('should delete the video', (done) => {
            chai.request(server)
                .delete(`/api/media/${videoId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Video deleted successfully');
                    done();
                });
        });
    });

    describe('PUT /api/media/:id', () => {
        let videoId;

        before(async () => {
            const video = new Video({
                videoUrl: 'test-video.mp4',
                description: 'Test video',
                author: authorId
            });
            await video.save();
            videoId = video._id.toString();
        });

        it('should update the video description', (done) => {
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
    });
});
