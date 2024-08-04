import * as chai from 'chai';
import Interaction from '../../../models/Interaction.js';
import mongoose from 'mongoose';

chai.use(chaiHttp);
const { expect } = chai;

describe('Interaction Model Tests', () => {
    it('should create an interaction', async () => {
        const interaction = new Interaction({
            userId: new mongoose.Types.ObjectId(),
            postId: new mongoose.Types.ObjectId(),
            interactionType: 'like'
        });
        const savedInteraction = await interaction.save();
        expect(savedInteraction).to.have.property('_id');
    });

    it('should not create an interaction without a required field', async () => {
        try {
            const interaction = new Interaction({
                userId: new mongoose.Types.ObjectId(),
                postId: new mongoose.Types.ObjectId()
            });
            await interaction.save();
        } catch (error) {
            expect(error).to.exist;
        }
    });
});
