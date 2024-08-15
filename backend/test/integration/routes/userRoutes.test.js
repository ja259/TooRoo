import * as chai from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import server from '../../../server.js';
import config from '../../../config/config.js';

const { expect } = chai;
const request = supertest(server);

describe('User Routes Tests', () => {
    let token;

    before(() => {
        // Use a valid ObjectId format for the userPayload
        const userPayload = { id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' }; 
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });
    });

    it('should get user details', (done) => {
        // Ensure you use a valid ObjectId string in the URL
        request
            .get('/api/users/60d0fe4f5311236168a109ca') // Using a valid ObjectId here
            .set('Authorization', `Bearer ${token}`) 
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('user'); // Assuming the response contains a user object
                done();
            });
    });
});
