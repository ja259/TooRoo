import * as chai from 'chai';
import chaiHttp from 'chai-http';
import gridFsStorageConfig from '../../../config/gridFsStorageConfig.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', (done) => {
        expect(gridFsStorageConfig).to.have.property('url');
        done();
    });

    it('should generate a valid filename using crypto', (done) => {
        gridFsStorageConfig.file(null, null, (err, file) => {
            expect(file).to.have.property('filename');
            done();
        });
    });
});
