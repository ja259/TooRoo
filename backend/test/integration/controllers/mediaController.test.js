import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Media Controller Tests', () => {
    let token;
    let user;

    before(async () => {
        user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            phone: '1234567890',
            securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
        });
        await user.save();

        const res = await chai.request(server)
            .post('/api/auth/login')
            .send({ emailOrPhone: 'testuser@example.com', password: 'password123' });

        token = res.body.token;
    });

    it('should upload a media file', (done) => {
        chai.request(server)
            .post('/api/media/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', 'test/test-files/test-video.mp4')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'File uploaded successfully');
                done();
            });
    });
});
