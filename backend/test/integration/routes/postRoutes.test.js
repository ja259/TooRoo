import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';
import Post from '../../../models/Post.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Post Routes Integration Tests', () => {
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

    it('should create a post on /api/posts POST', (done) => {
        chai.request(server)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'This is a test post' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'Post created successfully');
                done();
            });
    });
});
