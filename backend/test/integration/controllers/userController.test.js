import * as chai from 'chai';
import '../../setup.js';
import '../../teardown.js';
import app from '../../../server.js';

const { expect } = chai;

describe('User Controller Tests', () => {
    it('should get user details', (done) => {
        chai.request(app)
            .get('/api/users/1')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
