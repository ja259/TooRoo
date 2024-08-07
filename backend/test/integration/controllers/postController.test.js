import * as chai from 'chai';
import '../../setup.js';
import '../../teardown.js';
import app from '../../../server.js';

const { expect } = chai;

describe('Post Controller Tests', () => {
    it('should create a new post', (done) => {
        chai.request(app)
            .post('/api/posts')
            .send({ content: 'This is a test post' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });
});
