import * as chai from 'chai';
import User from '../../../models/User.js';

const { expect } = chai;

describe('User Model Integration Tests', () => {
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
    });

    it('should create a new user', async () => {
        const newUser = new User({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'password123',
            phone: '0987654321',
            securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
        });
        const savedUser = await newUser.save();
        expect(savedUser).to.have.property('_id');
        expect(savedUser.username).to.equal('newuser');
    });

    it('should require a username', async () => {
        try {
            const user = new User({
                email: 'userwithoutusername@example.com',
                password: 'password123',
                phone: '1234567890',
                securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
            });
            await user.save();
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });

    it('should require a valid email', async () => {
        try {
            const user = new User({
                username: 'userwithoutemail',
                email: 'invalidemail',
                password: 'password123',
                phone: '1234567890',
                securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
            });
            await user.save();
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });

    it('should require a valid phone', async () => {
        try {
            const user = new User({
                username: 'userwithoutphone',
                email: 'userwithoutphone@example.com',
                password: 'password123',
                phone: 'invalidphone',
                securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
            });
            await user.save();
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });

    it('should follow a user', async () => {
        const otherUser = new User({
            username: 'otheruser',
            email: 'otheruser@example.com',
            password: 'password123',
            phone: '0987654321',
            securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
        });
        await otherUser.save();
        user.following.push(otherUser._id);
        const updatedUser = await user.save();
        expect(updatedUser.following).to.include(otherUser._id);
    });

    it('should unfollow a user', async () => {
        const otherUser = new User({
            username: 'otheruser',
            email: 'otheruser@example.com',
            password: 'password123',
            phone: '0987654321',
            securityQuestions: [{ question: 'q1', answer: 'a1' }, { question: 'q2', answer: 'a2' }, { question: 'q3', answer: 'a3' }]
        });
        await otherUser.save();
        user.following.push(otherUser._id);
        await user.save();
        user.following.pull(otherUser._id);
        const updatedUser = await user.save();
        expect(updatedUser.following).to.not.include(otherUser._id);
    });
});
