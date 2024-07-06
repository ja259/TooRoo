import * as chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import sinon from 'sinon';
import server from '../server.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Video from '../models/Video.js';
import { Server } from 'socket.io';
import socketClient from 'socket.io-client';
import { config as dotenvConfig } from 'dotenv';

chai.use(chaiHttp);
dotenvConfig({ path: './.env' });

const { expect } = chai;

describe('Server and Routes Tests', function () {
    this.timeout(5000);

    before(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }
    });

    after(async () => {
        await mongoose.disconnect();
    });

    describe('Auth Routes', () => {
        beforeEach(async () => {
            await User.deleteMany({});
        });

        it('should register a user on /api/auth/register POST', (done) => {
            const user = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'User registered successfully');
                    done();
                });
        });

        it('should login a user on /api/auth/login POST', async () => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });
            user.password = bcrypt.hashSync(user.password, 12);
            await user.save();

            const res = await chai.request(server)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'password123' });

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('token');
        });
    });

    describe('User Routes', () => {
        let token = '';

        before(async () => {
            const user = {
                email: 'testuser@example.com',
                password: 'password123'
            };
            const res = await chai.request(server).post('/api/auth/login').send(user);
            token = res.body.token;
        });

        beforeEach(async () => {
            await User.deleteMany({});
        });

        it('should get user details on /api/users/:id GET', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });
            user.save((err, user) => {
                chai.request(server)
                    .get(`/api/users/${user._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('username', 'testuser');
                        done();
                    });
            });
        });

        it('should update user profile on /api/users/:id PUT', (done) => {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });
            user.save((err, user) => {
                const updatedUser = {
                    username: 'updateduser',
                    bio: 'Updated bio'
                };
                chai.request(server)
                    .put(`/api/users/${user._id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send(updatedUser)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message', 'User profile updated successfully.');
                        done();
                    });
            });
        });
    });

    describe('Post Routes', () => {
        let token = '';

        before(async () => {
            const user = {
                email: 'testuser@example.com',
                password: 'password123'
            };
            const res = await chai.request(server).post('/api/auth/login').send(user);
            token = res.body.token;
        });

        beforeEach(async () => {
            await Post.deleteMany({});
        });

        it('should create a post on /api/posts POST', (done) => {
            const post = {
                content: 'This is a test post'
            };
            chai.request(server)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send(post)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Post created successfully');
                    done();
                });
        });

        it('should get all posts on /api/posts GET', (done) => {
            chai.request(server)
                .get('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('Media Routes', () => {
        let token = '';

        before(async () => {
            const user = {
                email: 'testuser@example.com',
                password: 'password123'
            };
            const res = await chai.request(server).post('/api/auth/login').send(user);
            token = res.body.token;
        });

        beforeEach(async () => {
            await Video.deleteMany({});
        });

        it('should upload a media file on /upload POST', (done) => {
            chai.request(server)
                .post('/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('file', 'test/media/testfile.jpg')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'File uploaded successfully');
                    done();
                });
        });

        it('should get all videos on /api/media/you-all-videos GET', (done) => {
            chai.request(server)
                .get('/api/media/you-all-videos')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('Notification Routes', () => {
        it('should subscribe to push notifications on /subscribe POST', (done) => {
            const subscription = {
                endpoint: 'https://example.com/endpoint',
                keys: {
                    p256dh: 'BEXAMPLEKEY',
                    auth: 'AUTHKEY'
                }
            };
            chai.request(server)
                .post('/subscribe')
                .send(subscription)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });

    describe('Static Files', () => {
        it('should serve static files in production', (done) => {
            process.env.NODE_ENV = 'production';
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('Socket.io', () => {
        it('should handle socket connection', (done) => {
            const socket = socketClient(`http://localhost:${port}`);
            socket.on('connect', () => {
                socket.emit('message', 'Test message');
                socket.on('message', (msg) => {
                    expect(msg).to.eql('Test message');
                    socket.disconnect();
                    done();
                });
            });
        });
    });
});
