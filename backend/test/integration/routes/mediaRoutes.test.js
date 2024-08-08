import * as chai from 'chai';
import supertest from 'supertest';
import '../../setup.js';
import '../../teardown.js';
import server from '../../../server.js';

const { expect } = chai;
const request = supertest(server);

describe('Media Routes Tests', () => {
    it('should upload a media file', (done) => {
        request
            .post('/api/media/upload')
            .field('description', 'Test video')
            .field('authorId', 'validAuthorId')
            .attach('video', Buffer.from('testfile'), 'testfile.mp4')
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Video uploaded successfully');
                done();
            });
    });
});
