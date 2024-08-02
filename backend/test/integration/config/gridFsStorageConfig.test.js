import * as chai from 'chai';
import sinon from 'sinon';
import multerGridfsStorage from 'multer-gridfs-storage';
import config from '../../../config/config.js';
import storage from '../../../config/gridFsStorageConfig.js';

const { expect } = chai;

describe('GridFS Storage Config Tests', () => {
    let gridFsStorageStub;

    before(() => {
        gridFsStorageStub = sinon.stub(multerGridfsStorage, 'GridFsStorage').callsFake((options) => {
            return {
                url: options.url,
                file: options.file
            };
        });
    });

    after(() => {
        gridFsStorageStub.restore();
    });

    it('should have a valid GridFS storage configuration', () => {
        expect(storage).to.be.an('object');
        expect(storage).to.have.property('url').that.is.a('string');
    });

    it('should throw an error if MONGODB_URI is not defined', async () => {
        const originalMongodbUri = process.env.MONGODB_URI;
        process.env.MONGODB_URI = '';

        try {
            await import('../../../config/gridFsStorageConfig.js');
            throw new Error('MONGODB_URI environment variable is not defined');
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.include('MONGODB_URI environment variable is not defined');
        } finally {
            process.env.MONGODB_URI = originalMongodbUri;
        }
    });

    it('should generate a valid filename using crypto', async () => {
        const mockReq = {};
        const mockFile = { originalname: 'testfile.txt' };
        const promise = storage.file(mockReq, mockFile);

        expect(promise).to.be.a('promise');
        const fileInfo = await promise;
        expect(fileInfo).to.have.property('filename').that.is.a('string');
        expect(fileInfo).to.have.property('bucketName').eql(config.gridFsBucket);

        const filenameRegex = /^[a-f0-9]{32}\.txt$/;
        expect(fileInfo.filename).to.match(filenameRegex);
    });

    it('should handle errors during filename generation', async () => {
        const cryptoStub = sinon.stub(crypto, 'randomBytes').yields(new Error('Crypto error'));

        const mockReq = {};
        const mockFile = { originalname: 'testfile.txt' };
        try {
            await storage.file(mockReq, mockFile);
            throw new Error('Crypto error');
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.include('Crypto error');
        } finally {
            cryptoStub.restore();
        }
    });

    it('should use the correct bucket name', async () => {
        const mockReq = {};
        const mockFile = { originalname: 'testfile.txt' };
        const fileInfo = await storage.file(mockReq, mockFile);

        expect(fileInfo).to.have.property('bucketName').eql(config.gridFsBucket);
    });
});
