import * as chai from 'chai';
import chaiHttp from 'chai-http';
import '../../setup.js';
import '../../teardown.js';
import app from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Middleware Tests', () => {
    let authToken;

    before(async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        authToken = user.generateAuthToken();
    });

    it('should authenticate a valid token', (done) => {
        chai.request(app)
            .get('/api/protected-route')
            .set('Authorization', `Bearer ${authToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
