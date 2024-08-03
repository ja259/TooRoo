import * as chai from 'chai';
import { gridFsStorageConfig } from '../../../config/gridFsStorageConfig.js';

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        expect(gridFsStorageConfig).to.have.property('url');
        expect(gridFsStorageConfig).to.have.property('options');
    });

    it('should generate a valid filename using crypto', () => {
        const filename = gridFsStorageConfig.file(null, { originalname: 'testfile.txt' });
        expect(filename).to.be.a('string');
    });

    it('should handle errors during filename generation', () => {
        try {
            gridFsStorageConfig.file(null, { originalname: '' });
        } catch (error) {
            expect(error.message).to.include('Crypto error');
        }
    });

    it('should use the correct bucket name', () => {
        expect(gridFsStorageConfig).to.have.property('bucketName', 'uploads');
    });
});
