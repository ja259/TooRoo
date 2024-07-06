import chai from 'chai';
import mongoose from 'mongoose';
import User from '../../models/User.js';

const should = chai.should();

describe('User Model', () => {

    before(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should create a new user', (done) => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            fullName: 'Test User',
            birthdate: new Date('1990-01-01'),
            gender: 'male',
            securityQuestion1: 'Question1',
            securityAnswer1: 'Answer1',
            securityQuestion2: 'Question2',
            securityAnswer2: 'Answer2',
            securityQuestion3: 'Question3',
            securityAnswer3: 'Answer3'
        });
        user.save((err, user) => {
            should.not.exist(err);
            user.should.have.property('username').eql('testuser');
            user.should.have.property('email').eql('testuser@example.com');
            done();
        });
    });

    it('should require a username', (done) => {
        let user = new User({
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            fullName: 'Test User',
            birthdate: new Date('1990-01-01'),
            gender: 'male',
            securityQuestion1: 'Question1',
            securityAnswer1: 'Answer1',
            securityQuestion2: 'Question2',
            securityAnswer2: 'Answer2',
            securityQuestion3: 'Question3',
            securityAnswer3: 'Answer3'
        });
        user.save((err) => {
            should.exist(err);
            err.errors.should.have.property('username');
            err.errors.username.should.have.property('kind').eql('required');
            done();
        });
    });

    it('should require a valid email', (done) => {
        let user = new User({
            username: 'testuser',
            email: 'notanemail',
            phone: '1234567890',
            password: 'password123',
            fullName: 'Test User',
            birthdate: new Date('1990-01-01'),
            gender: 'male',
            securityQuestion1: 'Question1',
            securityAnswer1: 'Answer1',
            securityQuestion2: 'Question2',
            securityAnswer2: 'Answer2',
            securityQuestion3: 'Question3',
            securityAnswer3: 'Answer3'
        });
        user.save((err) => {
            should.exist(err);
            err.errors.should.have.property('email');
            err.errors.email.should.have.property('kind').eql('user defined');
            done();
        });
    });

    it('should require a valid gender', (done) => {
        let user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            fullName: 'Test User',
            birthdate: new Date('1990-01-01'),
            gender: 'invalid',
            securityQuestion1: 'Question1',
            securityAnswer1: 'Answer1',
            securityQuestion2: 'Question2',
            securityAnswer2: 'Answer2',
            securityQuestion3: 'Question3',
            securityAnswer3: 'Answer3'
        });
        user.save((err) => {
            should.exist(err);
            err.errors.should.have.property('gender');
            err.errors.gender.should.have.property('kind').eql('enum');
            done();
        });
    });

    it('should follow a user', async () => {
        let user1 = new User({
            username: 'testuser1',
            email: 'testuser1@example.com',
            phone: '1234567890',
            password: 'password123',
            fullName: 'Test User 1',
            birthdate: new Date('1990-01-01'),
            gender: 'male',
            securityQuestion1: 'Question1',
            securityAnswer1: 'Answer1',
            securityQuestion2: 'Question2',
            securityAnswer2: 'Answer2',
            securityQuestion3: 'Question3',
            securityAnswer3: 'Answer3'
        });
        await user1.save();

        let user2 = new User({
            username: 'testuser2',
            email: 'testuser2@example.com',
            phone: '1234567891',
            password: 'password123',
            fullName: 'Test User 2',
            birthdate: new Date('1990-01-01'),
            gender: 'male',
            securityQuestion1: 'Question1',
            securityAnswer1: 'Answer1',
            securityQuestion2: 'Question2',
            securityAnswer2: 'Answer2',
            securityQuestion3: 'Question3',
            securityAnswer3: 'Answer3'
        });
        await user2.save();

        user1.following.push(user2._id);
        user2.followers.push(user1._id);

        await user1.save();
        await user2.save();

        const updatedUser1 = await User.findById(user1._id);
        const updatedUser2 = await User.findById(user2._id);

        updatedUser1.following.should.include(user2._id);
        updatedUser2.followers.should.include(user1._id);
    });

    it('should unfollow a user', async () => {
        let user1 = new User({
            username: 'testuser1',
            email: 'testuser1@example.com',
            phone: '1234567890',
            password: 'password123',
            fullName: 'Test User 1',
            birthdate: new Date('1990-01-01'),
            gender: 'male',
            securityQuestion1: 'Question1',
            securityAnswer1: 'Answer1',
            securityQuestion2: 'Question2',
            securityAnswer2: 'Answer2',
            securityQuestion3: 'Question3',
            securityAnswer3: 'Answer3'
        });
        await user1.save();

        let user2 = new User({
            username: 'testuser2',
            email: 'testuser2@example.com',
            phone: '1234567891',
            password: 'password123',
            fullName: 'Test User 2',
            birthdate: new Date('1990-01-01'),
            gender: 'male',
            securityQuestion1: 'Question1',
            securityAnswer1: 'Answer1',
            securityQuestion2: 'Question2',
            securityAnswer2: 'Answer2',
            securityQuestion3: 'Question3',
            securityAnswer3: 'Answer3'
        });
        await user2.save();

        user1.following.push(user2._id);
        user2.followers.push(user1._id);

        await user1.save();
        await user2.save();

        user1.following.pull(user2._id);
        user2.followers.pull(user1._id);

        await user1.save();
        await user2.save();

        const updatedUser1 = await User.findById(user1._id);
        const updatedUser2 = await User.findById(user2._id);

        updatedUser1.following.should.not.include(user2._id);
        updatedUser2.followers.should.not.include(user1._id);
    });

    // Add more tests for validation, methods, and hooks
});
