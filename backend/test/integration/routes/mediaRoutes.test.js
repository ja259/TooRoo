import * as chai from 'chai';
import chaiHttp from 'chai-http';
import '../../setup.js';
import '../../teardown.js';
import app from '../../../server.js';
import User from '../../../models/User.js';
import fs from 'fs';
import path from 'path';

chai.use(chaiHttp);
const { expect } = chai;

describe('Media Routes Tests', () => {
    let authToken;

    before(async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        authToken = user.generateAuthToken();
    });

    it('should upload a media file', (done) => {
        chai.request(app)
            .post('/api/media/upload')
            .set('Authorization', `Bearer ${authToken}`)
            .attach('file', fs.readFileSync(path.resolve(__dirname, 'testfile.txt')), 'testfile.txt')
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
