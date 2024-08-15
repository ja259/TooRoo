import * as chai from 'chai';
import storage from '../../../config/gridFsStorageConfig.js';
import config from '../../../config/config.js'; // Import the config file to get the bucket name

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        expect(storage).to.have.property('db').that.is.an('object');
        expect(storage).to.have.property('url').that.is.a('string');
        expect(storage).to.have.property('options').that.is.an('object');
        expect(storage.options).to.have.property('bucketName').that.equals(config.gridFsBucket); // Use the actual bucket name from config
    });

    it('should generate a valid filename using crypto', async () => {
        const req = {};
        const file = { originalname: 'testfile.mp4' };
        const fileInfo = await storage.file(req, file);

        expect(fileInfo).to.have.property('filename').that.is.a('string');
        expect(fileInfo.filename).to.match(/^[a-f0-9]{32}\.mp4$/); // Ensure filename is 32 hex chars + .mp4
        expect(fileInfo).to.have.property('bucketName').that.equals(config.gridFsBucket); // Use the actual bucket name from config
    });
});
