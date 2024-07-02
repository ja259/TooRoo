const chai = require('chai');
const Post = require('../../models/Post');
const User = require('../../models/User');
const should = chai.should();

describe('Post Model', () => {

    beforeEach(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});
    });

    it('it should create a new post', (done) => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        user.save((err, user) => {
            let post = new Post({
                content: 'Test post',
                author: user._id
            });
            post.save((err, post) => {
                should.not.exist(err);
                post.should.have.property('content').eql('Test post');
                post.should.have.property('author').eql(user._id);
                done();
            });
        });
    });

    // Add more tests for validation, methods, and hooks

});
