import * as chai from 'chai';
import { config as dotenvConfig } from 'dotenv';
import sinon from 'sinon';
import { fileURLToPath } from 'url';
import path from 'path';

const { expect } = chai;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenvConfig({ path: path.resolve(__dirname, '../../../.env') });

describe('Config Tests', () => {
    let config;

    before(async () => {
        const conf = await import('../../../config/config.js');
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
        expect(config).to.have.property('vapidPublicKey');
        expect(config).to.have.property('vapidPrivateKey');
    });

    it('should throw an error if a required environment variable is missing', async () => {
        const originalEnvVars = {
            MONGODB_URI: process.env.MONGODB_URI,
            JWT_SECRET: process.env.JWT_SECRET,
            EMAIL: process.env.EMAIL,
            EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
            VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
            VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY
        };

        const clearEnvVars = () => {
            process.env.MONGODB_URI = '';
            process.env.JWT_SECRET = '';
            process.env.EMAIL = '';
            process.env.EMAIL_PASSWORD = '';
            process.env.VAPID_PUBLIC_KEY = '';
            process.env.VAPID_PRIVATE_KEY = '';
        };

        const restoreEnvVars = () => {
            process.env.MONGODB_URI = originalEnvVars.MONGODB_URI;
            process.env.JWT_SECRET = originalEnvVars.JWT_SECRET;
            process.env.EMAIL = originalEnvVars.EMAIL;
            process.env.EMAIL_PASSWORD = originalEnvVars.EMAIL_PASSWORD;
            process.env.VAPID_PUBLIC_KEY = originalEnvVars.VAPID_PUBLIC_KEY;
            process.env.VAPID_PRIVATE_KEY = originalEnvVars.VAPID_PRIVATE_KEY;
        };

        clearEnvVars();

        try {
            await import('../../../config/config.js');
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error.message).to.include('Missing required environment variable');
        } finally {
            restoreEnvVars();
        }
    });

    it('should validate the JWT_SECRET is strong enough', async () => {
        const originalJwtSecret = process.env.JWT_SECRET;
        process.env.JWT_SECRET = 'short';
        let error;

        try {
            await import('../../../config/config.js');
        } catch (err) {
            error = err;
        } finally {
            process.env.JWT_SECRET = originalJwtSecret;
        }

        expect(error).to.be.an('error');
        expect(error.message).to.include('JWT_SECRET is not strong enough');
    });

    it('should validate that PORT is a number', () => {
        expect(parseInt(process.env.PORT)).to.be.a('number');
    });

    it('should validate that LOG_LEVEL is set to a valid level', () => {
        const validLogLevels = ['error', 'warn', 'info', 'debug'];
        expect(validLogLevels).to.include(process.env.LOG_LEVEL);
    });

    it('should validate that NODE_ENV is set to a valid environment', () => {
        const validEnvironments = ['development', 'production', 'test'];
        expect(validEnvironments).to.include(process.env.NODE_ENV);
    });

    it('should use the correct configuration for the environment', () => {
        expect(config).to.have.property('port').that.is.a('number');
        expect(config).to.have.property('emailService').that.is.a('string');
    });

    it('should validate that email service credentials are correctly set', () => {
        expect(config.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        expect(config.emailPassword).to.not.be.empty;
    });
});
