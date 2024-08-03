import { expect } from 'chai';
import config from '../../../config/config.js';

describe('Config Tests', () => {
    it('should contain required environment variables', () => {
        const requiredEnvVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'EMAIL', 'EMAIL_PASSWORD', 'EMAIL_SERVICE', 'VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY'];
        requiredEnvVars.forEach((varName) => {
            expect(process.env[varName]).to.exist;
        });
    });

    it('should validate the JWT_SECRET is strong enough', () => {
        expect(config.jwtSecret).to.have.lengthOf.at.least(32);
    });

    it('should use the correct configuration for the environment', () => {
        expect(config.port).to.be.a('number');
        expect(config.corsOrigins).to.be.an('array');
    });
});
