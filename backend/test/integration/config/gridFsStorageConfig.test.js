import * as chai from 'chai';
import storage from '../../../config/gridFsStorageConfig.js';
import config from '../../../config/config.js';

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        expect(storage).to.have.property('db'); // Check if `db` exists
        expect(storage).to.have.property('url').that.is.a('string'); // Check for URL
        expect(storage.options).to.have.property('bucketName').that.equals(config.gridFsBucket); // Check bucket name
    });

    it('should generate a valid filename using crypto', async () => {
        const req = {};
        const file = { originalname: 'testfile.mp4' };
        const fileInfo = await storage._generate(req, file); // Corrected function to `_generate`

        expect(fileInfo).to.have.property('filename').that.is.a('string');
        expect(fileInfo.filename).to.match(/^[a-f0-9]{32}\.mp4$/);
        expect(fileInfo).to.have.property('bucketName').that.equals(config.gridFsBucket);
    });
});
