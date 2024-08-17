import * as chai from 'chai';
import supertest from 'supertest';
import server from '../../../server.js';

const { expect } = chai;
const request = supertest(server);

describe('User Controller Tests', () => {
    let token;

    before(async () => {
        // Set up user and token here
        token = jwt.sign({ id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' }, config.jwtSecret, { expiresIn: '1h' });
    });

    it('should get user details', async () => {
        const res = await request
            .get('/api/users/60d0fe4f5311236168a109ca')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(res.body).to.have.property('message', 'User profile retrieved successfully');
        expect(res.body.user).to.have.property('_id', '60d0fe4f5311236168a109ca');
    });
});
