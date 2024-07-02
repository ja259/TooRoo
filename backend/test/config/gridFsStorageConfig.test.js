const chai = require('chai');
const gridFsStorage = require('../../config/gridFsStorageConfig');
const should = chai.should();

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        gridFsStorage.should.be.an('object');
    });

    it('should throw an error if MONGODB_URI is not defined', () => {
        process.env.MONGODB_URI = '';
        try {
            require('../../config/gridFsStorageConfig');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.include('MONGODB_URI environment variable is not defined');
        }
    });
});
