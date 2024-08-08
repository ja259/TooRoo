import * as chai from 'chai';
import supertest from 'supertest';
import server from '../../../server.js';

const { expect } = chai;
const request = supertest(server);

describe('Post Routes Tests', () => {
    it('should create a new post', (done) => {
        request
            .post('/api/posts')
            .set('Authorization', 'Bearer validToken') // Ensure valid token
            .send({ content: 'Test content', authorId: 'validAuthorId' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Post created successfully');
                done();
            });
    });
});
