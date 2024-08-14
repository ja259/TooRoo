import * as chai from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken'; // Import jwt to generate a token
import server from '../../../server.js';
import config from '../../../config/config.js'; // Assuming you have a config file with your secret

const { expect } = chai;
const request = supertest(server);

describe('Post Routes Tests', () => {
    let token;

    before(() => {
        // Generate a valid token
        const userPayload = { id: 'testUserId', email: 'testuser@example.com' };
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });
    });

    it('should create a new post', (done) => {
        request
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`) // Use the generated token
            .send({ content: 'Test content', authorId: 'validAuthorId' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Post created successfully');
                done();
            });
    });
});
