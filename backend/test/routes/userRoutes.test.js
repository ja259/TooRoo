const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const User = require('../../models/User');
const should = chai.should();

chai.use(chaiHttp);

describe('User Routes', () => {

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('/GET user profile', () => {
        it('it should GET a user profile by the given id', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            user.save((err, user) => {
                chai.request(server)
                    .get(`/api/users/${user._id}`)
                    .set('Authorization', `Bearer ${user.generateAuthToken()}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('User profile retrieved successfully');
                        done();
                    });
            });
        });
    });

    // Add tests for updateUserProfile, followUser, unfollowUser

});
