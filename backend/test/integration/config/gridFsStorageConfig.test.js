import * as chai from 'chai';
import gridFsStorageConfig from '../../../config/gridFsStorageConfig.js';

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        expect(gridFsStorageConfig).to.have.property('url');
    });

    it('should generate a valid filename using crypto', async () => {
        const req = {};
        const file = {};
        const info = await gridFsStorageConfig.file(req, file);
        expect(info).to.have.property('filename').that.is.a('string');
    });
});
