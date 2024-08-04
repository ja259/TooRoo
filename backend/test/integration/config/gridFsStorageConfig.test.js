import * as chai from 'chai';
import chaiHttp from 'chai-http'; // Ensure chai-http is imported
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';
import config from '../../../config/config.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        const storage = new GridFsStorage({ url: config.dbUri });
        expect(storage).to.have.property('url');
    });

    it('should generate a valid filename using crypto', (done) => {
        const storage = new GridFsStorage({
            url: config.dbUri,
            file: (req, file) => {
                return new Promise((resolve, reject) => {
                    crypto.randomBytes(16, (err, buf) => {
                        if (err) {
                            return reject(err);
                        }
                        const filename = buf.toString('hex') + path.extname(file.originalname);
                        const fileInfo = { filename: filename, bucketName: config.gridFsBucket };
                        resolve(fileInfo);
                    });
                });
            }
        });

        storage.file({}, { originalname: 'testfile.txt' })
            .then(fileInfo => {
                expect(fileInfo).to.have.property('filename');
                expect(fileInfo).to.have.property('bucketName', config.gridFsBucket);
                done();
            })
            .catch(err => done(err));
    });
});
