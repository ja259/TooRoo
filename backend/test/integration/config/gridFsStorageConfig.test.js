import * as chai from 'chai';
import storage from '../../../config/gridFsStorageConfig.js';

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        expect(storage).to.have.property('db').that.is.a('function');
        expect(storage).to.have.property('url').that.is.a('string');
    });

    it('should generate a valid filename using crypto', async () => {
        const req = {};
        const file = { originalname: 'testfile.mp4' };
        const info = await storage._handleFile(req, file);
        expect(info).to.have.property('filename').that.is.a('string');
    });
});
