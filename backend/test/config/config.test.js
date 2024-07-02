const chai = require('chai');
const config = require('../../config/config');
const should = chai.should();

describe('Config Tests', () => {
    it('should have a valid configuration object', () => {
        config.should.be.an('object');
    });

    it('should contain required environment variables', () => {
        config.should.have.property('dbUri');
        config.should.have.property('jwtSecret');
        config.should.have.property('email');
        config.should.have.property('emailPassword');
    });

    it('should throw an error if a required environment variable is missing', () => {
        process.env.DEV_JWT_SECRET = '';
        try {
            require('../../config/config');
        } catch (error) {
            error.should.be.an('error');
            error.message.should.include('Missing required environment variable');
        }
    });
});
