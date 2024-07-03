import chai, { should } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server.js';
import User from '../../models/User.js';

should();
chai.use(chaiHttp);

describe('Auth Controller', () => {

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

    describe('/POST login', () => {
        it('it should login a user', (done) => {
            let user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123',
                securityQuestions: [
                    { question: 'Question1', answer: 'Answer1' },
                    { question: 'Question2', answer: 'Answer2' },
                    { question: 'Question3', answer: 'Answer3' }
                ]
            });
            user.password = bcrypt.hashSync(user.password, 12);
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/auth/login')
                    .send({ emailOrPhone: 'testuser@example.com', password: 'password123' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('message').eql('Logged in successfully');
                        done();
                    });
            });
        });
    });

    // Add tests for forgotPassword and resetPassword
});
