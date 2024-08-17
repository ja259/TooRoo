import * as chai from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';
import server from '../../../server.js';
import config from '../../../config/config.js';

chai.use(chaiHttp);
const { expect } = chai;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Media Routes Tests', () => {
    let token;

    before(() => {
        const userPayload = { id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' };
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });
    });

    it('should upload a media file', (done) => {
        chai.request(server)
            .post('/api/media/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', path.resolve(__dirname, '../../fixtures/testfile.mp4'))
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'File uploaded successfully');
                done();
            });
    });
});
