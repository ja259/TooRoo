import * as chai from 'chai';
import sinon from 'sinon';
import crypto from 'crypto';
import pkg from 'multer-gridfs-storage';
import config from '../../../config/config.js';
import storage from '../../../config/gridFsStorageConfig.js';

const { expect, should } = chai;
should();

describe('GridFS Storage Config Tests', () => {
    let gridFsStorageStub;

    before(() => {
        gridFsStorageStub = sinon.stub(pkg, 'GridFsStorage').callsFake((options) => {
            return {
                url: options.url,
                options: options.options,
                file: options.file
            };
        });
    });

    after(() => {
        gridFsStorageStub.restore();
    });

    it('should have a valid GridFS storage configuration', () => {
        storage.should.be.an('object');
        storage.should.have.property('url').that.is.a('string');
        storage.should.have.property('options').that.is.an('object');
        storage.options.should.have.property('useNewUrlParser').eql(true);
        storage.options.should.have.property('useUnifiedTopology').eql(true);
    });

    it('should throw an error if MONGODB_URI is not defined', async () => {
        const originalMongodbUri = process.env.MONGODB_URI;
        process.env.MONGODB_URI = '';

        try {
            await import('../../../config/gridFsStorageConfig.js');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.include('MONGODB_URI environment variable is not defined');
        } finally {
            process.env.MONGODB_URI = originalMongodbUri;
        }
    });

    it('should generate a valid filename using crypto', async () => {
        const mockReq = {};
        const mockFile = { originalname: 'testfile.txt' };
        const promise = storage.file(mockReq, mockFile);

        promise.should.be.a('promise');
        const fileInfo = await promise;
        fileInfo.should.have.property('filename').that.is.a('string');
        fileInfo.should.have.property('bucketName').eql(process.env.GRIDFS_BUCKET || 'uploads');

        const filenameRegex = /^[a-f0-9]{32}\.txt$/;
        fileInfo.filename.should.match(filenameRegex);
    });

    it('should handle errors during filename generation', async () => {
        const cryptoStub = sinon.stub(crypto, 'randomBytes').yields(new Error('Crypto error'));

        const mockReq = {};
        const mockFile = { originalname: 'testfile.txt' };
        try {
            await storage.file(mockReq, mockFile);
        } catch (error) {
            error.should.be.an('error');
            error.message.should.include('Crypto error');
        } finally {
            cryptoStub.restore();
        }
    });

    it('should use the correct bucket name', () => {
        storage.should.have.property('file').that.is.a('function');
        const mockReq = {};
        const mockFile = { originalname: 'testfile.txt' };
        const promise = storage.file(mockReq, mockFile);

        promise.should.be.a('promise');
        promise.then((fileInfo) => {
            fileInfo.should.have.property('bucketName').eql(process.env.GRIDFS_BUCKET || 'uploads');
        }).catch((err) => {
            should.not.exist(err);
        });
    });
});
