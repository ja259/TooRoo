import * as chai from 'chai';
import supertest from 'supertest';
import path from 'path';
import server from '../../../server.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { expect } = chai;
const request = supertest(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Upload Middleware Tests', () => {
    it('should upload a valid image file', (done) => {
        request.post('/api/media/upload') // Ensure the route is correct
            .attach('file', path.resolve(__dirname, '../../fixtures/testfile.jpg'))
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'File uploaded successfully');
                done();
            });
    });

    it('should reject files larger than the allowed size', (done) => {
        request.post('/api/media/upload') // Ensure the route is correct
            .attach('file', path.resolve(__dirname, '../../fixtures/largefile.mp4'))
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message').that.includes('File too large');
                done();
            });
    });

    it('should reject files with disallowed types', (done) => {
        request.post('/api/media/upload') // Ensure the route is correct
            .attach('file', path.resolve(__dirname, '../../fixtures/testfile.txt'))
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message').that.includes('Only images and videos are allowed');
                done();
            });
    });

    it('should handle Multer errors correctly', (done) => {
        request.post('/api/media/upload') // Ensure the route is correct
            .attach('file', path.resolve(__dirname, '../../fixtures/testfile.jpg'))
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message').that.includes('Multer error');
                done();
            });
    });
});
