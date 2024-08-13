import * as chai from 'chai';
import supertest from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import server from '../../../server.js';

const { expect } = chai;
const request = supertest(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Media Routes Tests', () => {
    it('should upload a media file', (done) => {
        request
            .post('/api/media/upload')
            .set('Authorization', 'Bearer validToken') // Ensure valid token
            .attach('file', path.resolve(__dirname, '../../fixtures/testfile.mp4'))
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'File uploaded successfully');
                done();
            });
    });
});
