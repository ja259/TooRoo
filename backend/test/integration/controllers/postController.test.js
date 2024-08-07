import * as chai from 'chai';
import chaiHttp from 'chai-http';
import '../../setup.js';
import '../../teardown.js';
import app from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Post Controller Tests', () => {
    let authToken;

    before(async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        authToken = user.generateAuthToken();
    });

    it('should create a new post', (done) => {
        chai.request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ content: 'This is a new post' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });
});
