import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Controller Tests', () => {
    let token, userId;

    before(async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        const savedUser = await user.save();
        userId = savedUser._id;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    after(async () => {
        await User.deleteMany({});
    });

    describe('GET /api/users/:id', () => {
        it('should get user details', (done) => {
            chai.request(server)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('username', 'testuser');
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
        it('should update user profile', (done) => {
            const updatedUser = {
                username: 'updateduser',
                bio: 'Updated bio'
            };
            chai.request(server)
                .put(`/api/users/${userId}`)
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
