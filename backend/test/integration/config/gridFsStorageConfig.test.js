import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';
import gridFsStorageConfig from '../../../config/gridFsStorageConfig.js';

chai.use(chaiHttp);
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
