import * as chai from 'chai';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import server from '../../../server.js';
import config from '../../../config/config.js';

const { expect } = chai;
const request = supertest(server);

describe('Media Controller Tests', () => {
    let token;

    before(() => {
        const userPayload = { id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' };
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });
    });

    it('should upload a media file', (done) => {
        request
            .post('/api/media/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('video', path.resolve(__dirname, '../../fixtures/testfile.mp4'))
            .field('authorId', '60d0fe4f5311236168a109ca')
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Video uploaded successfully');
                done();
            });
    });
});
