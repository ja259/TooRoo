import '../../setup.js';
import '../../teardown.js';
import * as chai from 'chai';
import recommendContent from '../../../recommendContent.js';

const { expect } = chai;

describe('Recommend Content Service Tests', () => {
    it('should recommend content for a user', async () => {
        const recommendations = await recommendContent('validUserId');
        expect(recommendations).to.be.an('array');
    });

    it('should handle errors during content recommendation', async () => {
        try {
            await recommendContent(null);
        } catch (error) {
            expect(error.message).to.equal('User ID is required');
        }
    });
});
