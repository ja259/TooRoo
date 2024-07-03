import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import Video from '../../models/Video.js';
import User from '../../models/User.js';

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
                    .attach('video', 'test/media/testfile.mp4')
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.have.property('message').eql('Video uploaded successfully');
                        done();
                    });
            });
        });
    });

    // Add tests for getAllVideos, deleteVideo, updateVideo
});
