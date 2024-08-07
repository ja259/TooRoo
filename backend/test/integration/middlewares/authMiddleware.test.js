import * as chai from 'chai';
import '../../setup.js';
import '../../teardown.js';
import app from '../../../server.js';

const { expect } = chai;

describe('Auth Middleware Tests', () => {
    it('should authenticate a valid token', (done) => {
        chai.request(app)
            .get('/api/protected-route')
            .set('Authorization', 'Bearer validtoken')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
