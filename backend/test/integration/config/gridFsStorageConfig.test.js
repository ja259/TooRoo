import '../../setup.js';
import '../../teardown.js';
import * as chai from 'chai';
import chaiHttp from 'chai-http/index.js'; 
import crypto from 'crypto';
import gridFsStorageConfig from '../../../config/gridFsStorageConfig.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', (done) => {
        expect(gridFsStorageConfig).to.have.property('url');
        expect(gridFsStorageConfig).to.have.property('options');
        done();
    });

    it('should generate a valid filename using crypto', (done) => {
        const fileInfo = gridFsStorageConfig.file(null, { originalname: 'testfile.jpg' });
        expect(fileInfo).to.have.property('filename');
        expect(fileInfo).to.have.property('bucketName', 'uploads');
        done();
    });
});
