import chai from 'chai';
import { GridFsStorage } from 'multer-gridfs-storage';
import config from '../../config/config.js';

const should = chai.should();

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        const storage = new GridFsStorage({ url: config.dbUri });
        storage.should.be.an('object');
    });

    it('should throw an error if MONGODB_URI is not defined', () => {
        process.env.MONGODB_URI = '';
        try {
            new GridFsStorage({});
        } catch (error) {
            error.should.be.an('error');
            error.message.should.include('Missing required environment variable');
        }
    });
});
