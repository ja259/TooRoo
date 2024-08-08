import * as chai from 'chai';
import storage from '../../../config/gridFsStorageConfig.js';

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        expect(storage).to.have.property('url');
    });

    it('should generate a valid filename using crypto', async () => {
        const req = {};
        const file = { originalname: 'testfile.mp4' };
        const info = await storage.file(req, file);
        expect(info).to.have.property('filename').that.is.a('string');
    });
});
