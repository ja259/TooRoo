import * as chai from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import server from '../../../server.js';
import config from '../../../config/config.js';

const { expect } = chai;
const request = supertest(server);

describe('User Controller Tests', () => {
    let token;

    before(() => {
        token = jwt.sign({ id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' }, config.jwtSecret, { expiresIn: '1h' });
    });

    it('should get user details', (done) => {
        request
            .get('/api/users/60d0fe4f5311236168a109ca')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'User profile retrieved successfully');
                expect(res.body.user).to.have.property('_id', '60d0fe4f5311236168a109ca');
                done();
            });
    });
});
