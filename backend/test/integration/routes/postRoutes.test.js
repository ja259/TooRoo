import * as chai from 'chai';
import supertest from 'supertest';
import '../../setup.js';
import '../../teardown.js';
import server from '../../../server.js';

const { expect } = chai;
const request = supertest(server);

describe('Post Routes Tests', () => {
    it('should create a new post', (done) => {
        request
            .post('/api/posts')
            .field('content', 'Test content')
            .field('authorId', 'validAuthorId')
            .attach('video', Buffer.from('testfile'), 'testfile.mp4')
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Post created successfully');
                done();
            });
    });
});
