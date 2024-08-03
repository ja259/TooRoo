import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Server and Routes Tests', () => {
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

    it('should register a user on /api/auth/register POST', (done) => {
        chai.request(server)
            .post('/api/auth/register')
            .send({
                username: 'newuser',
                email: 'newuser@example.com',
                password: 'password123',
                phone: '0987654321',
                securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'User registered successfully');
                done();
            });
    });

    it('should login a user on /api/auth/login POST', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({ emailOrPhone: 'testuser@example.com', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should get user details on /api/users/:id GET', (done) => {
        chai.request(server)
            .get(`/api/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('username', 'testuser');
                done();
            });
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

    it('should upload a media file on /api/media/upload POST', (done) => {
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
