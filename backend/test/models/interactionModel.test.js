import * as chai from 'chai';
import mongoose from 'mongoose';
import Interaction from '../../models/Interaction.js';
import User from '../../models/User.js';
import Post from '../../models/Post.js';

const should = chai.should();

describe('Interaction Model', () => {

    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    beforeEach(async () => {
        await Interaction.deleteMany({});
        await User.deleteMany({});
        await Post.deleteMany({});
    });

    after(async () => {
        await mongoose.connection.close();
    });

    it('it should create an interaction', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();

        const post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();

        const interaction = new Interaction({
            userId: user._id,
            postId: post._id,
            interactionType: 'like'
        });

        const savedInteraction = await interaction.save();
        savedInteraction.should.have.property('userId').eql(user._id);
        savedInteraction.should.have.property('postId').eql(post._id);
        savedInteraction.should.have.property('interactionType').eql('like');
    });

    it('it should not create an interaction without a required field', async () => {
        const interaction = new Interaction({
            interactionType: 'like'
        });
        try {
            await interaction.save();
        } catch (error) {
            error.should.be.an('error');
            error.errors.should.have.property('userId');
            error.errors.should.have.property('postId');
        }
    });

    it('it should find an interaction by ID', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();

        const post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();

        const interaction = new Interaction({
            userId: user._id,
            postId: post._id,
            interactionType: 'comment'
        });
        await interaction.save();

        const foundInteraction = await Interaction.findById(interaction._id).populate('userId').populate('postId');
        foundInteraction.should.have.property('userId').eql(user._id);
        foundInteraction.should.have.property('postId').eql(post._id);
        foundInteraction.should.have.property('interactionType').eql('comment');
    });

    it('it should update an interaction', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();

        const post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();

        const interaction = new Interaction({
            userId: user._id,
            postId: post._id,
            interactionType: 'share'
        });
        await interaction.save();

        interaction.interactionType = 'like';
        const updatedInteraction = await interaction.save();
        updatedInteraction.should.have.property('interactionType').eql('like');
    });

    it('it should delete an interaction', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();

        const post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();

        const interaction = new Interaction({
            userId: user._id,
            postId: post._id,
            interactionType: 'comment'
        });
        await interaction.save();

        await Interaction.findByIdAndRemove(interaction._id);
        const foundInteraction = await Interaction.findById(interaction._id);
        should.not.exist(foundInteraction);
    });

    it('it should not create an interaction with an invalid interactionType', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123'
        });
        await user.save();

        const post = new Post({
            content: 'Test post',
            author: user._id
        });
        await post.save();

        const interaction = new Interaction({
            userId: user._id,
            postId: post._id,
            interactionType: 'invalidType'
        });
        try {
            await interaction.save();
        } catch (error) {
            error.should.be.an('error');
            error.errors.should.have.property('interactionType');
        }
    });

});
