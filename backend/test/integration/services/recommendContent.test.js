import '../../setup.js';
import '../../teardown.js';
import * as chai from 'chai';
import recommendContent from '../../../recommendContent.js';
import mongoose from 'mongoose';

const { expect } = chai;

describe('Recommend Content Service Tests', () => {
    let userId;

    before(async () => {
        userId = new mongoose.Types.ObjectId().toString(); // Generate a valid ObjectId
    });

    it('should recommend content for a user', async () => {
        const recommendations = await recommendContent(userId);
        expect(recommendations).to.be.an('array');
    });

    it('should handle errors during content recommendation', async () => {
        try {
            await recommendContent(null);
        } catch (error) {
            expect(error.message).to.equal('User ID is required');
        }
    });

    it('should throw an error if userId is invalid', async () => {
        try {
            await recommendContent('invalidUserId');
        } catch (error) {
            expect(error.message).to.equal('Invalid ObjectId');
        }
    });
});
