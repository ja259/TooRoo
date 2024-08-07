import * as chai from 'chai';
import gridFsStorageConfig from '../../../config/gridFsStorageConfig.js';

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', (done) => {
        expect(gridFsStorageConfig).to.have.property('url');
        done();
    });

    it('should generate a valid filename using crypto', (done) => {
        const req = {};
        const file = { originalname: 'testfile.txt' };
        gridFsStorageConfig.file(req, file, (err, info) => {
            expect(info).to.have.property('filename');
            done();
        });
    });
});
