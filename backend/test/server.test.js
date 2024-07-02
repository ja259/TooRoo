require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const server = require('../server'); // Adjust the path as needed
const should = chai.should();

chai.use(chaiHttp);

describe('TooRoo Backend Tests', () => {

    before((done) => {
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('Connected to MongoDB');
                done();
            })
            .catch(err => {
                console.error('MongoDB connection error:', err);
                done(err);
            });
    });

    after((done) => {
        mongoose.disconnect()
            .then(() => {
                console.log('Disconnected from MongoDB');
                done();
            })
            .catch(err => {
                console.error('MongoDB disconnection error:', err);
                done(err);
            });
    });

    describe('Auth Routes', () => {
        it('should register a user on /api/auth/register POST', (done) => {
            let user = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('User registered successfully');
                    done();
                });
        });

        it('should login a user on /api/auth/login POST', (done) => {
            let user = {
                email: 'testuser@example.com',
                password: 'password123'
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });
    });

    describe('User Routes', () => {
        let token = '';

        before((done) => {
            let user = {
                email: 'testuser@example.com',
                password: 'password123'
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });

        it('should get user details on /api/users/:id GET', (done) => {
            chai.request(server)
                .get('/api/users/testuser')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql('testuser');
                    done();
                });
        });
    });

    describe('Post Routes', () => {
        let token = '';

        before((done) => {
            let user = {
                email: 'testuser@example.com',
                password: 'password123'
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });

        it('should create a post on /api/posts POST', (done) => {
            let post = {
                content: 'This is a test post'
            };
            chai.request(server)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .send(post)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Post created successfully');
                    done();
                });
        });

        it('should get all posts on /api/posts GET', (done) => {
            chai.request(server)
                .get('/api/posts')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe('Media Routes', () => {
        let token = '';

        before((done) => {
            let user = {
                email: 'testuser@example.com',
                password: 'password123'
            };
            chai.request(server)
                .post('/api/auth/login')
                .send(user)
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });

        it('should upload a media file on /upload POST', (done) => {
            chai.request(server)
                .post('/upload')
                .set('Authorization', `Bearer ${token}`)
                .attach('file', 'test/media/testfile.jpg')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('File uploaded successfully');
                    done();
                });
        });
    });

    describe('Notification Routes', () => {
        it('should subscribe to push notifications on /subscribe POST', (done) => {
            let subscription = {
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
                    res.should.have.status(201);
                    res.body.should.be.a('object');
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
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('Socket.io', () => {
        it('should handle socket connection', (done) => {
            const socket = require('socket.io-client')(`http://localhost:${port}`);
            socket.on('connect', () => {
                socket.emit('message', 'Test message');
                socket.on('message', (msg) => {
                    msg.should.eql('Test message');
                    socket.disconnect();
                    done();
                });
            });
        });
    });

});
