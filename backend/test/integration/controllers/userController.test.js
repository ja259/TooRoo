import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Controller Tests', () => {
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

    it('should get user details', (done) => {
        chai.request(server)
            .get(`/api/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('username', 'testuser');
                done();
            });
    });

    it('should return 404 for non-existent user', (done) => {
        chai.request(server)
            .get('/api/users/604c26f8f2b4f3b5c4a5e5a1')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('message', 'User not found');
                done();
            });
    });

    it('should update user details', (done) => {
        chai.request(server)
            .put(`/api/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ username: 'updateduser' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'User updated successfully');
                done();
            });
    });

    it('should delete a user', (done) => {
        chai.request(server)
            .delete(`/api/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'User deleted successfully');
                done();
            });
    });

    it('should get all users', (done) => {
        chai.request(server)
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
});
