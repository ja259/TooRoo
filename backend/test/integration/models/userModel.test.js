import * as chai from 'chai';
import mongoose from 'mongoose';
import User from '../../../models/User.js';
import dotenv from 'dotenv';

dotenv.config();
chai.should();

describe('User Model Integration Tests', () => {
    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    after(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should create a new user', async () => {
        const user = new User({
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
        const savedUser = await user.save();
        savedUser.should.have.property('username').eql('testuser');
        savedUser.should.have.property('email').eql('testuser@example.com');
    });

    it('should require a username', async () => {
        const user = new User({
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: [
                { question: 'Question1', answer: 'Answer1' },
                { question: 'Question2', answer: 'Answer2' },
                { question: 'Question3', answer: 'Answer3' }
            ]
        });
        try {
            await user.save();
        } catch (error) {
            error.should.be.an('error');
            error.errors.should.have.property('username');
            error.errors.username.should.have.property('kind').eql('required');
        }
    });

    it('should require a valid email', async () => {
        const user = new User({
            username: 'testuser',
            email: 'notanemail',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: [
                { question: 'Question1', answer: 'Answer1' },
                { question: 'Question2', answer: 'Answer2' },
                { question: 'Question3', answer: 'Answer3' }
            ]
        });
        try {
            await user.save();
        } catch (error) {
            error.should.be.an('error');
            error.errors.should.have.property('email');
            error.errors.email.should.have.property('kind').eql('user defined');
        }
    });

    it('should require a valid phone', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: 'invalidphone',
            password: 'password123',
            securityQuestions: [
                { question: 'Question1', answer: 'Answer1' },
                { question: 'Question2', answer: 'Answer2' },
                { question: 'Question3', answer: 'Answer3' }
            ]
        });
        try {
            await user.save();
        } catch (error) {
            error.should.be.an('error');
            error.errors.should.have.property('phone');
            error.errors.phone.should.have.property('kind').eql('user defined');
        }
    });

    it('should follow a user', async () => {
        const user1 = new User({
            username: 'testuser1',
            email: 'testuser1@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: [
                { question: 'Question1', answer: 'Answer1' },
                { question: 'Question2', answer: 'Answer2' },
                { question: 'Question3', answer: 'Answer3' }
            ]
        });
        await user1.save();

        const user2 = new User({
            username: 'testuser2',
            email: 'testuser2@example.com',
            phone: '1234567891',
            password: 'password123',
            securityQuestions: [
                { question: 'Question1', answer: 'Answer1' },
                { question: 'Question2', answer: 'Answer2' },
                { question: 'Question3', answer: 'Answer3' }
            ]
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
        const user1 = new User({
            username: 'testuser1',
            email: 'testuser1@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: [
                { question: 'Question1', answer: 'Answer1' },
                { question: 'Question2', answer: 'Answer2' },
                { question: 'Question3', answer: 'Answer3' }
            ]
        });
        await user1.save();

        const user2 = new User({
            username: 'testuser2',
            email: 'testuser2@example.com',
            phone: '1234567891',
            password: 'password123',
            securityQuestions: [
                { question: 'Question1', answer: 'Answer1' },
                { question: 'Question2', answer: 'Answer2' },
                { question: 'Question3', answer: 'Answer3' }
            ]
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
});
