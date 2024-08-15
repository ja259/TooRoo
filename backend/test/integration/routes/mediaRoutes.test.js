import * as chai from 'chai';
import supertest from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken'; // Import jwt to generate a token
import server from '../../../server.js';
import config from '../../../config/config.js'; // Assuming you have a config file with your secret

const { expect } = chai;
const request = supertest(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Media Routes Tests', () => {
    let token;

    before(() => {
        // Generate a valid token with a valid ObjectId
        const userPayload = { id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' };
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });
    });

    it('should upload a media file', (done) => {
        request
            .post('/api/media/upload')
            .set('Authorization', `Bearer ${token}`) // Use the generated token
            .attach('file', path.resolve(__dirname, '../../fixtures/testfile.mp4'))
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'File uploaded successfully');
                done();
            });
    });
});
