import * as chai from 'chai';
import { execSync } from 'child_process';

const { expect } = chai;

describe('Config Tests', () => {
    let config;

    before(async () => {
        const conf = await import('../config/config.js');
        config = conf.default;
    });

    it('should have a valid configuration object', () => {
        expect(config).to.be.an('object');
    });

    it('should contain required environment variables', () => {
        expect(config).to.have.property('dbUri');
        expect(config).to.have.property('jwtSecret');
        expect(config).to.have.property('email');
        expect(config).to.have.property('emailPassword');
    });

    it('should throw an error if a required environment variable is missing', async () => {
        const originalJwtSecret = process.env.DEV_JWT_SECRET;
        process.env.DEV_JWT_SECRET = '';

        try {
            await import('../config/config.js');
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.include('Missing required environment variable');
        } finally {
            process.env.DEV_JWT_SECRET = originalJwtSecret;
        }
    });
});
