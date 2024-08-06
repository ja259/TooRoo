import '../../setup.js';
import '../../teardown.js';
import * as chai from 'chai';
import crypto from 'crypto';
import gridFsStorageConfig from '../../../config/gridFsStorageConfig.js';

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', (done) => {
        expect(gridFsStorageConfig).to.have.property('url');
        expect(gridFsStorageConfig).to.have.property('options');
        done();
    });

    it('should generate a valid filename using crypto', (done) => {
        const filename = crypto.randomBytes(16).toString('hex');
        expect(filename).to.be.a('string');
        expect(filename).to.have.lengthOf(32);
        done();
    });
});
