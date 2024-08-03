import * as chai from 'chai';
import recommendContent from '../../recommendContent.js';

const { expect } = chai;

describe('Recommend Content Service Tests', () => {
    it('should recommend content based on preferences', async () => {
        const userId = 'testUserId';
        const result = await recommendContent(userId);
        expect(result).to.be.an('array');
    });

    it('should handle errors during content recommendation', async () => {
        const userId = 'errorUserId';
        try {
            await recommendContent(userId);
        } catch (error) {
            expect(error.message).to.equal('Recommendation error');
        }
    });
});
