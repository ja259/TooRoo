import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import '../../setup.js';
import '../../teardown.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Media Routes Tests', () => {
    it('should upload a media file', (done) => {
        chai.request(server)
            .post('/api/media/upload')
            .field('description', 'Test video')
            .field('authorId', 'validAuthorId')
            .attach('video', Buffer.from('testfile'), 'testfile.mp4')
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'Video uploaded successfully');
                done();
            });
    });
});
