import * as chai from 'chai';
import supertest from 'supertest';
import path from 'path';
import server from '../../../server.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { expect } = chai;
const request = supertest(server);

// Use these to get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Upload Middleware Tests', () => {

    before(async () => {
        // Apply global setup tasks (like database connection)
        await import('../../setup.js');
    });

    after(async () => {
        // Apply global teardown tasks (like closing database connection)
        await import('../../teardown.js');
    });

    it('should upload a valid image file', (done) => {
        request.post('/api/upload')  // Adjust the route based on your setup
            .attach('file', path.resolve(__dirname, '../../fixtures/testfile.jpg'))
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'File uploaded successfully');
                done();
            });
    });

    it('should reject files larger than the allowed size', (done) => {
        request.post('/api/upload')
            .attach('file', path.resolve(__dirname, '../../fixtures/largefile.mp4'))
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message').that.includes('File too large');
                done();
            });
    });

    it('should reject files with disallowed types', (done) => {
        request.post('/api/upload')
            .attach('file', path.resolve(__dirname, '../../fixtures/testfile.txt'))
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message').that.includes('Only images and videos are allowed');
                done();
            });
    });

    it('should handle Multer errors correctly', (done) => {
        // Simulate a Multer-specific error, e.g., a memory storage limit reached
        // You may need to mock or simulate this based on your test setup
        request.post('/api/upload')
            .attach('file', path.resolve(__dirname, '../../fixtures/testfile.jpg'))
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message').that.includes('Multer error');
                done();
            });
    });

});
