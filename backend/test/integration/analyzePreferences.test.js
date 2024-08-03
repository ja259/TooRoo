import * as chai from 'chai';
import sinon from 'sinon';
import analyzePreferences from '../../analyzePreferences.js';

const { expect } = chai;

describe('Analyze Preferences Service Tests', () => {
    it('should analyze user preferences correctly', async () => {
        const userId = 'testUserId';
        const result = await analyzePreferences(userId);
        expect(result).to.be.an('object');
    });

    it('should handle no interactions found', async () => {
        const userId = 'noInteractionsUserId';
        const result = await analyzePreferences(userId);
        expect(result).to.be.an('object').that.is.empty;
    });

    it('should handle errors during preference analysis', async () => {
        const userId = 'errorUserId';
        try {
            await analyzePreferences(userId);
        } catch (error) {
            expect(error.message).to.equal('Analysis error');
        }
    });

    it('should throw an error if userId is not provided', async () => {
        try {
            await analyzePreferences();
        } catch (error) {
            expect(error.message).to.equal('User ID is required');
        }
    });
});
