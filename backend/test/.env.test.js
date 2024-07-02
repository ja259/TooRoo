const chai = require('chai');
const dotenv = require('dotenv');
const should = chai.should();

describe('Environment Variables Tests', () => {
    it('should load environment variables from .env file', () => {
        const result = dotenv.config({ path: './.env' });
        result.should.have.property('parsed');
        result.parsed.should.have.property('MONGODB_URI');
        result.parsed.should.have.property('JWT_SECRET');
        result.parsed.should.have.property('EMAIL');
        result.parsed.should.have.property('EMAIL_PASSWORD');
    });
});
