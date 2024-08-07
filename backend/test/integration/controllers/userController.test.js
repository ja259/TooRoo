import '../../setup.js';
import '../../teardown.js';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Controller Tests', () => {
    let userToken;
    let userId;

    before(async () => {
        await User.deleteMany({});
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: [
                { question: 'First pet?', answer: 'Fluffy' },
                { question: 'Mother\'s maiden name?', answer: 'Smith' },
                { question: 'Favorite color?', answer: 'Blue' }
            ]
        });
        await user.save();
        userToken = user.generateAuthToken();
        userId = user._id;
    });

    it('should get user details', (done) => {
        chai.request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'User profile retrieved successfully');
                done();
            });
    });
});
