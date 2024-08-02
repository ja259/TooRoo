import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { connectDB, disconnectDB } from '../../../db.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Controller Tests', () => {
    let token, userId;

    before(async () => {
        await connectDB();
    });

    after(async () => {
        await disconnectDB();
    });

    beforeEach(async () => {
        await User.deleteMany({});

        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            phone: '1234567890',
            securityQuestions: [
                { question: 'What is your pet’s name?', answer: 'Fluffy' },
                { question: 'What is your mother’s maiden name?', answer: 'Smith' },
                { question: 'What is your favorite color?', answer: 'Blue' }
            ]
        });
        const savedUser = await user.save();
        userId = savedUser._id;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    describe('GET /api/users/:id', () => {
        it('should get user details', (done) => {
            chai.request(server)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.user).to.have.property('username', 'testuser');
                    done();
                });
        });

        it('should return 404 for non-existent user', (done) => {
            chai.request(server)
                .get('/api/users/invalidId')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message', 'User not found');
                    done();
                });
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update user details', (done) => {
            const updatedDetails = { username: 'updatedUser' };
            chai.request(server)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedDetails)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.user).to.have.property('username', 'updatedUser');
                    done();
                });
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete a user', (done) => {
            chai.request(server)
                .delete(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'User deleted successfully');
                    done();
                });
        });
    });

    describe('GET /api/users', () => {
        it('should get all users', (done) => {
            chai.request(server)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.users).to.be.an('array');
                    done();
                });
        });
    });
});
