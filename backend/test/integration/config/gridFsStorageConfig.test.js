import * as chai from 'chai';
import sinon from 'sinon';
import crypto from 'crypto';
import gridFsStorageConfig from '../../../config/gridFsStorageConfig.js';

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should have a valid GridFS storage configuration', (done) => {
        expect(gridFsStorageConfig).to.have.property('url');
        done();
    });

    it('should generate a valid filename using crypto', (done) => {
        const req = {};
        const file = { originalname: 'testfile.txt' };
        const callback = sandbox.stub();
        const filename = crypto.randomBytes(16).toString('hex') + '_' + file.originalname;

        callback(null, { filename });

        gridFsStorageConfig.file(req, file, callback);

        expect(callback.calledOnce).to.be.true;
        expect(callback.args[0][1]).to.have.property('filename', filename);
        done();
    });
});
