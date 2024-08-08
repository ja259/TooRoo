import * as chai from 'chai';
import supertest from 'supertest';
import '../../setup.js';
import '../../teardown.js';
import server from '../../../server.js';

const { expect } = chai;
const request = supertest(server);

describe('User Routes Tests', () => {
    it('should get user details', (done) => {
        request
            .get('/api/users/validUserId')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'User profile retrieved successfully');
                done();
            });
    });
});
