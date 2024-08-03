import * as chai from 'chai';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';
import config from '../../../config/config.js';
import { Request } from 'express';
import { File as MulterFile } from 'multer';

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        const storage = new GridFsStorage({ url: config.dbUri });
        expect(storage).to.be.an('object');
        expect(storage).to.have.property('options');
        expect(storage.options).to.have.property('url', config.dbUri);
    });

    it('should generate a valid filename using crypto', (done) => {
        const storage = new GridFsStorage({
            url: config.dbUri,
            file: (req: Request, file: MulterFile) => {
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

        // Mocking request and file objects for testing _handleFile method
        const reqMock = {} as Request;
        const fileMock = { originalname: 'testfile.txt' } as MulterFile;

        storage._handleFile(reqMock, fileMock, (err, fileInfo) => {
            if (err) return done(err);
            expect(fileInfo).to.have.property('filename');
            expect(fileInfo).to.have.property('bucketName', config.gridFsBucket);
            done();
        });
    });
});
