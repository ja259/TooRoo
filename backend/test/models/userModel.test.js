const chai = require('chai');
const User = require('../../models/User');
const should = chai.should();

describe('User Model', () => {

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('it should create a new user', (done) => {
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
        user.save((err, user) => {
            should.not.exist(err);
            user.should.have.property('username').eql('testuser');
            user.should.have.property('email').eql('testuser@example.com');
            done();
        });
    });

    // Add more tests for validation, methods, and hooks

});
