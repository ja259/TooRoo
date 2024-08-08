import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import '../../setup.js';
import '../../teardown.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Post Routes Tests', () => {
    it('should create a new post', (done) => {
        chai.request(server)
            .post('/api/posts')
            .field('content', 'Test content')
            .field('authorId', 'validAuthorId')
            .attach('video', Buffer.from('testfile'), 'testfile.mp4')
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'Post created successfully');
                done();
            });
    });
});
