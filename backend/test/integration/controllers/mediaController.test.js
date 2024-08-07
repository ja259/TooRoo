import * as chai from 'chai';
import '../../setup.js';
import '../../teardown.js';
import app from '../../../server.js';

const { expect } = chai;

describe('Media Controller Tests', () => {
    it('should upload a media file', (done) => {
        chai.request(app)
            .post('/api/media/upload')
            .attach('file', 'path/to/testfile.jpg', 'testfile.jpg')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
