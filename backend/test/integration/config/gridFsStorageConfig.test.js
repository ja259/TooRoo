import { expect } from 'chai';
import storage from '../../../config/gridFsStorageConfig.js';

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        expect(storage).to.have.property('url');
    });

    it('should generate a valid filename using crypto', async () => {
        const file = { originalname: 'testfile.txt' };
        const req = {};
        const fileInfo = await storage.file(req, file);
        expect(fileInfo).to.have.property('filename');
        expect(fileInfo).to.have.property('bucketName', 'uploads');
    });
});
