import * as chai from 'chai';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: './.env' });
const { expect, should } = chai;
should();

describe('Environment Variables Tests', () => {
    it('should load environment variables from .env file', () => {
        process.env.should.have.property('MONGODB_URI').that.is.a('string');
        process.env.should.have.property('JWT_SECRET').that.is.a('string');
        process.env.should.have.property('EMAIL').that.is.a('string');
        process.env.should.have.property('EMAIL_PASSWORD').that.is.a('string');
        process.env.should.have.property('PORT').that.is.a('string');
        process.env.should.have.property('EMAIL_SERVICE').that.is.a('string');
        process.env.should.have.property('CORS_ORIGIN').that.is.a('string');
        process.env.should.have.property('GRIDFS_BUCKET').that.is.a('string');
        process.env.should.have.property('LOG_LEVEL').that.is.a('string');
        process.env.should.have.property('GOOGLE_API_KEY').that.is.a('string');
        process.env.should.have.property('STRIPE_API_KEY').that.is.a('string');
        process.env.should.have.property('NODE_ENV').that.is.a('string');
        process.env.should.have.property('VAPID_PUBLIC_KEY').that.is.a('string');
        process.env.should.have.property('VAPID_PRIVATE_KEY').that.is.a('string');
    });

    it('should validate the JWT_SECRET is strong enough', () => {
        process.env.JWT_SECRET.length.should.be.above(8);
    });

    it('should validate that PORT is a number', () => {
        parseInt(process.env.PORT).should.be.a('number');
    });

    it('should validate that LOG_LEVEL is set to a valid level', () => {
        const validLogLevels = ['error', 'warn', 'info', 'debug'];
        validLogLevels.should.include(process.env.LOG_LEVEL);
    });

    it('should validate that NODE_ENV is set to a valid environment', () => {
        const validEnvironments = ['development', 'production', 'test'];
        validEnvironments.should.include(process.env.NODE_ENV);
    });

    it('should validate the MONGODB_URI format', () => {
        const uriPattern = /^mongodb(\+srv)?:\/\/.+$/;
        uriPattern.test(process.env.MONGODB_URI).should.be.true;
    });

    it('should validate EMAIL is a valid email format', () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        emailPattern.test(process.env.EMAIL).should.be.true;
    });

    it('should validate CORS_ORIGIN contains valid URLs', () => {
        const origins = process.env.CORS_ORIGIN.split(',');
        origins.forEach(origin => {
            const urlPattern = /^(https?:\/\/)?([^\s$.?#].[^\s]*)?$/i;
            urlPattern.test(origin).should.be.true;
        });
    });

    it('should validate that GRIDFS_BUCKET is not empty', () => {
        process.env.GRIDFS_BUCKET.should.not.be.empty;
    });

    it('should validate that GOOGLE_API_KEY is set', () => {
        process.env.GOOGLE_API_KEY.should.not.be.empty;
    });

    it('should validate that STRIPE_API_KEY is set', () => {
        process.env.STRIPE_API_KEY.should.not.be.empty;
    });

    it('should validate that VAPID_PUBLIC_KEY is not empty', () => {
        process.env.VAPID_PUBLIC_KEY.should.not.be.empty;
    });

    it('should validate that VAPID_PRIVATE_KEY is not empty', () => {
        process.env.VAPID_PRIVATE_KEY.should.not.be.empty;
    });
});
