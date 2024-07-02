const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const Post = require('../../models/Post');
const User = require('../../models/User');
const should = chai.should();

chai.use(chaiHttp);

describe('Post Controller', () => {

    beforeEach(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});
    });

    describe('/POST create post', () => {
        it('it should create a post', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/posts')
                    .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                    .send({ content: 'Test post', authorId: user._id })
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.have.property('message').eql('Post created successfully');
                        done();
                    });
            });
        });
    });

    // Add tests for getPosts, likePost, commentOnPost, deletePost, getTimelinePosts, getYouAllVideos, getFollowingVideos

});
