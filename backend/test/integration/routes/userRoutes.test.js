import * as chai from 'chai';
import chaiHttp from 'chai-http/index.js';
import '../../setup.js';
import '../../teardown.js';
import app from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Routes Tests', () => {
    let authToken;

    before(async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        authToken = user.generateAuthToken();
    });

    it('should get user details', (done) => {
        chai.request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
