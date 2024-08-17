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

describe('Post Routes Tests', () => {
    let token;

    before(() => {
        const userPayload = { id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' };
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });
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

    it('should retrieve posts', (done) => {
        request.get('/api/posts')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.posts).to.be.an('array');
                done();
            });
    });
});
