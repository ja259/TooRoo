import * as chai from 'chai';
import sinon from 'sinon';
import '../../setup.js';
import '../../teardown.js';
import gridFsStorageConfig from '../../../config/gridFsStorageConfig.js';

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        expect(gridFsStorageConfig).to.have.property('url');
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
