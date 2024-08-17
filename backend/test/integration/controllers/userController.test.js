import * as chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import server from '../../../server.js';
import config from '../../../config/config.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Controller Tests', () => {
    let token;

    before(() => {
        const userPayload = { id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' };
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });
    });

    it('should get user details', (done) => {
        chai.request(server)
            .get('/api/users/60d0fe4f5311236168a109ca')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('user');
                done();
            });
    });
});
