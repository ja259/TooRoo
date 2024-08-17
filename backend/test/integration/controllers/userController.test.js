import * as chai from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import server from '../../../server.js';
import config from '../../../config/config.js';
import User from '../../../models/User.js';
import Post from '../../../models/Post.js';

// Import setup and teardown scripts
import '../../setup.js';
import '../../teardown.js';

const { expect } = chai;
const request = supertest(server);

describe('User Controller Tests', () => {
    let token;

    before(async () => {
        const userPayload = { id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' };
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });

        // Ensure the user exists in the database
        await User.create({
            _id: '60d0fe4f5311236168a109ca',
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'hashed_password',
        });
    });

    it('should get user details', (done) => {
        request.get('/api/users/60d0fe4f5311236168a109ca')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('user');
                done();
            });
    });
});
