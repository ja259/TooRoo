const chai = require('chai');
const Video = require('../../models/Video');
const User = require('../../models/User');
const should = chai.should();

describe('Video Model', () => {

    beforeEach(async () => {
        await Video.deleteMany({});
        await User.deleteMany({});
    });

    it('it should create a new video', (done) => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        user.save((err, user) => {
            let video = new Video({
                videoUrl: 'testfile.mp4',
                description: 'Test video',
                author: user._id
            });
            video.save((err, video) => {
                should.not.exist(err);
                video.should.have.property('videoUrl').eql('testfile.mp4');
                video.should.have.property('description').eql('Test video');
                video.should.have.property('author').eql(user._id);
                done();
            });
        });
    });

    // Add more tests for validation, methods, and hooks

});
