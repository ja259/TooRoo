import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';

const should = chai.should();
chai.use(chaiHttp);

describe('Auth Routes', () => {

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('/POST register', () => {
        it('it should register a user', (done) => {
            let user = {
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'Question1', answer: 'Answer1' },
                    { question: 'Question2', answer: 'Answer2' },
                    { question: 'Question3', answer: 'Answer3' }
                ]
            };
            chai.request(server)
                .post('/api/auth/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('message').eql('User registered successfully');
                    done();
                });
        });
    });

    // Add tests for login, forgotPassword, resetPassword

});
