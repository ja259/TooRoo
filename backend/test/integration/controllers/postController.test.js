import * as chai from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import server from '../../../server.js';
import config from '../../../config/config.js';
import User from '../../../models/User.js';

// Import setup and teardown scripts
import '../../setup.js';
import '../../teardown.js';

const { expect } = chai;
const request = supertest(server);

describe('Post Controller Tests', () => {
    let token;

    before(async () => {
        const userPayload = { id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' };
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });

        // Ensure the user exists in the database
        await User.create({ _id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com', password: 'hashed_password' });
    });

    it('should create a new post', (done) => {
        request.post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Test content', authorId: '60d0fe4f5311236168a109ca' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Post created successfully');
                done();
            });
    });
});
