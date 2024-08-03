import { expect } from 'chai';
import Interaction from '../../../models/Interaction.js';

describe('Interaction Model Tests', () => {
    it('should create an interaction', async () => {
        const interaction = new Interaction({
            userId: 'user_id',
            postId: 'post_id',
            interactionType: 'like'
        });
        const savedInteraction = await interaction.save();
        expect(savedInteraction).to.have.property('_id');
    });

    it('should not create an interaction without a required field', async () => {
        try {
            const interaction = new Interaction({
                userId: 'user_id',
                postId: 'post_id'
            });
            await interaction.save();
        } catch (error) {
            expect(error).to.exist;
        }
    });
});
