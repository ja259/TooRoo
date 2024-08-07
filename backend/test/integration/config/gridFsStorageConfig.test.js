import '../../setup.js';
import '../../teardown.js';
import * as chai from 'chai';
import gridFsStorageConfig from '../../../config/gridFsStorageConfig.js';

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        expect(gridFsStorageConfig).to.have.property('url');
    });

    it('should generate a valid filename using crypto', (done) => {
        gridFsStorageConfig.file(null, null, (error, filename) => {
            expect(filename).to.be.a('string');
            done();
        });
    });
});
