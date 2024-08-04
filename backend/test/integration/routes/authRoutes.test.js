import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Routes Tests', () => {
    let token;

    before(async () => {
        await User.deleteMany();
        const user = new User({
            username: 'testuser',
            email: 'test@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        token = user.generateAuthToken();
    });

    it('should register a new user', (done) => {
        chai.request(app)
            .post('/api/auth/register')
            .send({ username: 'testuser2', email: 'test2@example.com', phone: '1234567891', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('should login an existing user', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should send a password reset token', (done) => {
        chai.request(app)
            .post('/api/auth/forgot-password')
            .send({ email: 'test@example.com' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should reset the password with valid token and security answers', (done) => {
        const resetToken = 'valid-reset-token';
        chai.request(app)
            .put(`/api/auth/reset-password/${resetToken}`)
            .send({ password: 'newpassword123', securityAnswers: ['answer1', 'answer2', 'answer3'] })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('Media Routes Tests', () => {
    let token;

    before(async () => {
        await User.deleteMany();
        const user = new User({
            username: 'testuser',
            email: 'test@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        token = user.generateAuthToken();
    });

    it('should upload a media file', (done) => {
        chai.request(app)
            .post('/api/media/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', 'path/to/file.jpg')
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });
});

describe('Post Routes Tests', () => {
    let token;

    before(async () => {
        await User.deleteMany();
        const user = new User({
            username: 'testuser',
            email: 'test@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        token = user.generateAuthToken();
    });

    it('should create a new post', (done) => {
        chai.request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Test post content' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });
});

describe('User Routes Tests', () => {
    let token;

    before(async () => {
        await User.deleteMany();
        const user = new User({
            username: 'testuser',
            email: 'test@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();
        token = user.generateAuthToken();
    });

    it('should get user details', (done) => {
        chai.request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
