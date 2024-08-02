import chai from 'chai';
import mongoose from 'mongoose';
import Interaction from '../../../models/Interaction.js';
import User from '../../../models/User.js';
import Post from '../../../models/Post.js';
import dotenv from 'dotenv';

dotenv.config();
const { expect } = chai;

describe('Interaction Model Integration Tests', () => {
    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    beforeEach(async () => {
        await Interaction.deleteMany({});
        await User.deleteMany({});
        await Post.deleteMany({});
    });

    after(async () => {
        await mongoose.connection.close();
    });

    it('should create an interaction', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();

        const post = new Post({ content: 'Test post', author: user._id });
        await post.save();

        const interaction = new Interaction({ userId: user._id, postId: post._id, interactionType: 'like' });
        const savedInteraction = await interaction.save();
        expect(savedInteraction).to.have.property('userId').eql(user._id);
        expect(savedInteraction).to.have.property('postId').eql(post._id);
        expect(savedInteraction).to.have.property('interactionType').eql('like');
    });

    it('should not create an interaction without a required field', async () => {
        const interaction = new Interaction({ interactionType: 'like' });
        try {
            await interaction.save();
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.errors).to.have.property('userId');
            expect(error.errors).to.have.property('postId');
        }
    });

    it('should find an interaction by ID', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();

        const post = new Post({ content: 'Test post', author: user._id });
        await post.save();

        const interaction = new Interaction({ userId: user._id, postId: post._id, interactionType: 'comment' });
        await interaction.save();

        const foundInteraction = await Interaction.findById(interaction._id).populate('userId').populate('postId');
        expect(foundInteraction).to.have.property('userId').eql(user._id);
        expect(foundInteraction).to.have.property('postId').eql(post._id);
        expect(foundInteraction).to.have.property('interactionType').eql('comment');
    });

    it('should update an interaction', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();

        const post = new Post({ content: 'Test post', author: user._id });
        await post.save();

        const interaction = new Interaction({ userId: user._id, postId: post._id, interactionType: 'share' });
        await interaction.save();

        interaction.interactionType = 'like';
        const updatedInteraction = await interaction.save();
        expect(updatedInteraction).to.have.property('interactionType').eql('like');
    });

    it('should delete an interaction', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();

        const post = new Post({ content: 'Test post', author: user._id });
        await post.save();

        const interaction = new Interaction({ userId: user._id, postId: post._id, interactionType: 'comment' });
        await interaction.save();

        await Interaction.findByIdAndRemove(interaction._id);
        const foundInteraction = await Interaction.findById(interaction._id);
        expect(foundInteraction).to.be.null;
    });

    it('should not create an interaction with an invalid interactionType', async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();

        const post = new Post({ content: 'Test post', author: user._id });
        await post.save();

        const interaction = new Interaction({ userId: user._id, postId: post._id, interactionType: 'invalidType' });
        try {
            await interaction.save();
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.errors).to.have.property('interactionType');
        }
    });
});
