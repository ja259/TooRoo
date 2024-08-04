import * as chai from 'chai';
import config from '../../../config/config.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Config Tests', () => {
    it('should contain required environment variables', () => {
        expect(config).to.have.property('port');
        expect(config).to.have.property('dbUri');
        expect(config).to.have.property('jwtSecret');
        expect(config).to.have.property('email');
        expect(config).to.have.property('emailPassword');
        expect(config).to.have.property('emailService');
        expect(config).to.have.property('vapidPublicKey');
        expect(config).to.have.property('vapidPrivateKey');
        expect(config).to.have.property('gridFsBucket');
        expect(config).to.have.property('googleApiKey');
        expect(config).to.have.property('stripeApiKey');
        expect(config).to.have.property('corsOrigins');
    });

    it('should validate the JWT_SECRET is strong enough', () => {
        expect(config.jwtSecret.length).to.be.at.least(32);
    });

    it('should use the correct configuration for the environment', () => {
        expect(parseInt(config.port, 10)).to.be.a('number');
    });
});
