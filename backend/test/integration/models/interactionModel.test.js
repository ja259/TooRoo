import * as chai from 'chai';
import Interaction from '../../../models/Interaction.js';

const { expect } = chai;

describe('Interaction Model Integration Tests', () => {
    it('should create an interaction', async () => {
        const interaction = new Interaction({
            userId: 'testUserId',
            postId: 'testPostId',
            type: 'like'
        });
        const savedInteraction = await interaction.save();
        expect(savedInteraction).to.have.property('_id');
        expect(savedInteraction.userId.toString()).to.equal('testUserId');
        expect(savedInteraction.postId.toString()).to.equal('testPostId');
        expect(savedInteraction.type).to.equal('like');
    });

    it('should not create an interaction without a required field', async () => {
        try {
            const interaction = new Interaction({});
            await interaction.save();
        } catch (error) {
            expect(error).to.be.an('error');
        }
    });
});
