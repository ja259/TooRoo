import * as chai from 'chai';
import { config } from '../../../config/config.js';

const { expect } = chai;

describe('Config Tests', () => {
    it('should contain required environment variables', () => {
        const requiredEnvVars = ['PORT', 'JWT_SECRET', 'MONGODB_URI', 'EMAIL_SERVICE', 'EMAIL_USER', 'EMAIL_PASS'];
        requiredEnvVars.forEach(envVar => {
            expect(process.env).to.have.property(envVar);
        });
    });

    it('should validate the JWT_SECRET is strong enough', () => {
        const jwtSecret = process.env.JWT_SECRET;
        expect(jwtSecret).to.be.a('string');
        expect(jwtSecret).to.have.length.above(10);
    });

    it('should use the correct configuration for the environment', () => {
        const port = parseInt(process.env.PORT, 10);
        expect(port).to.be.a('number');
        expect(port).to.equal(config.port);
    });

    it('should validate that PORT is a number', () => {
        expect(config.port).to.be.a('number');
    });

    it('should validate that LOG_LEVEL is set to a valid level', () => {
        const validLogLevels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];
        expect(validLogLevels).to.include(config.logLevel);
    });

    it('should validate that NODE_ENV is set to a valid environment', () => {
        const validEnvironments = ['development', 'production', 'test'];
        expect(validEnvironments).to.include(config.env);
    });

    it('should validate that email service credentials are correctly set', () => {
        expect(config.email.service).to.be.a('string');
        expect(config.email.auth.user).to.be.a('string');
        expect(config.email.auth.pass).to.be.a('string');
    });

    it('should use the correct configuration for the environment', () => {
        expect(config.port).to.equal(parseInt(process.env.PORT, 10));
    });
});
