import * as chai from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import server from '../../../server.js';
import config from '../../../config/config.js';

// Import setup and teardown scripts
import '../../setup.js';
import '../../teardown.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { expect } = chai;
const request = supertest(server);

describe('User Routes Tests', () => {
    let token;

    before(() => {
        const userPayload = { id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' };
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });
    });

    it('should retrieve user details', (done) => {
        request.get('/api/users/60d0fe4f5311236168a109ca')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.user).to.have.property('username');
                done();
            });
    });

    it('should update user profile', (done) => {
        request.put('/api/users/60d0fe4f5311236168a109ca')
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'newusername' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.user).to.have.property('username', 'newusername');
                done();
            });
    });
});
