import * as chai from 'chai';
import supertest from 'supertest';
import path from 'path';
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

describe('Media Routes Tests', () => {
    let token;

    before(() => {
        const userPayload = { id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' };
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });
    });

    it('should upload a media file', (done) => {
        request.post('/api/media/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', path.resolve(__dirname, '../../fixtures/testfile.mp4'))
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'File uploaded successfully');
                done();
            });
    });
});
