import '../../setup.js';
import '../../teardown.js';
import * as chai from 'chai';
import chaiHttp from 'chai-http/index.js';
import User from '../../../models/User.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('User Model Tests', () => {
    beforeEach(async () => {
        await User.deleteMany();
    });

    it('should create a new user', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: [
                { question: 'First pet?', answer: 'Fluffy' },
                { question: 'Mother\'s maiden name?', answer: 'Smith' },
                { question: 'Favorite color?', answer: 'Blue' }
            ]
        });
        const savedUser = await user.save();
        expect(savedUser).to.have.property('_id');
    });

    it('should require a username', async () => {
        try {
            const user = new User({
                email: 'testuser@example.com',
                phone: '1234567890',
                password: 'password123'
            });
            await user.save();
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it('should require a valid email', async () => {
        try {
            const user = new User({
                username: 'testuser',
                email: 'invalidemail',
                phone: '1234567890',
                password: 'password123'
            });
            await user.save();
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it('should require a valid phone', async () => {
        try {
            const user = new User({
                username: 'testuser',
                email: 'testuser@example.com',
                phone: 'invalidphone',
                password: 'password123'
            });
            await user.save();
        } catch (error) {
            expect(error).to.exist;
        }
    });

    it('should follow a user', async () => {
        const user1 = new User({
            username: 'testuser1',
            email: 'testuser1@example.com',
            phone: '1234567891',
            password: 'password123'
        });
        await user1.save();

        const user2 = new User({
            username: 'testuser2',
            email: 'testuser2@example.com',
            phone: '1234567892',
            password: 'password123'
        });
        await user2.save();

        user1.following.push(user2._id);
        await user1.save();

        expect(user1.following).to.include(user2._id);
    });

    it('should unfollow a user', async () => {
        const user1 = new User({
            username: 'testuser1',
            email: 'testuser1@example.com',
            phone: '1234567891',
            password: 'password123'
        });
        await user1.save();

        const user2 = new User({
            username: 'testuser2',
            email: 'testuser2@example.com',
            phone: '1234567892',
            password: 'password123'
        });
        await user2.save();

        user1.following.push(user2._id);
        await user1.save();

        user1.following.pull(user2._id);
        await user1.save();

        expect(user1.following).to.not.include(user2._id);
    });
});
