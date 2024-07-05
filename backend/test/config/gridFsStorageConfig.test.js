import * as chai from 'chai';
import { config as dotenvConfig } from 'dotenv';
import storage from '../../config/gridFsStorageConfig.js';

dotenvConfig({ path: './.env' });
const { should } = chai;
should();

describe('GridFS Storage Config Tests', () => {
    it('should have a valid GridFS storage configuration', () => {
        storage.should.be.an('object');
    });

    it('should throw an error if MONGODB_URI is not defined', async () => {
        const originalMongodbUri = process.env.MONGODB_URI;
        process.env.MONGODB_URI = '';

        try {
            await import('../../config/gridFsStorageConfig.js');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.include('MONGODB_URI environment variable is not defined');
        } finally {
            process.env.MONGODB_URI = originalMongodbUri;
        }
    });
});


