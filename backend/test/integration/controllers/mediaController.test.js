import * as chai from 'chai';
import supertest from 'supertest';
import path from 'path';
import jwt from 'jsonwebtoken';
import server from '../../../server.js';
import config from '../../../config/config.js';
import User from '../../../models/User.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { expect } = chai;
const request = supertest(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Media Controller Tests', () => {
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

    it('should upload a media file', (done) => {
        request.post('/api/media/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', path.resolve(__dirname, '../../fixtures/testfile.mp4'))
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Video uploaded successfully');
                done();
            });
    });
});
