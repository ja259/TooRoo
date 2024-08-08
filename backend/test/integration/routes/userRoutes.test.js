import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';
import '../../setup.js';
import '../../teardown.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('User Routes Tests', () => {
    it('should get user details', (done) => {
        chai.request(app)
            .get('/api/users/validUserId')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'User profile retrieved successfully');
                done();
            });
    });
});
