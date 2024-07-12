import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
chai.use(chaiHttp);
chai.should();

describe('Auth Routes Tests', () => {

    before((done) => {
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => done())
            .catch(err => done(err));
    });

    after((done) => {
        mongoose.disconnect()
            .then(() => done())
            .catch(err => done(err));
    });

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
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User registered successfully');
                done();
            });
    });

    it('should login a user on /api/auth/login POST', (done) => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        user.save((err, user) => {
            chai.request(server)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'password123' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });
    });

    it('should send forgot password email on /api/auth/forgot-password POST', (done) => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        user.save((err, user) => {
            chai.request(server)
                .post('/api/auth/forgot-password')
                .send({ email: user.email })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Password reset token sent');
                    done();
                });
        });
    });

    it('should reset password on /api/auth/reset-password/:token PUT', (done) => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        user.save((err, user) => {
            chai.request(server)
                .post('/api/auth/forgot-password')
                .send({ email: user.email })
                .end((err, res) => {
                    chai.request(server)
                        .put(`/api/auth/reset-password/${res.body.token}`)
                        .send({ password: 'newpassword123' })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('message').eql('Password has been reset successfully');
                            done();
                        });
                });
        });
    });
});
