import * as chai from 'chai';
import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const { expect } = chai;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file
dotenvConfig({ path: path.resolve(__dirname, '../../.env') });

describe('Environment Variables', () => {
    it('should load the MONGODB_URI environment variable', () => {
        expect(process.env.MONGODB_URI).to.be.a('string').and.not.be.empty;
    });

    it('should load the JWT_SECRET environment variable', () => {
        expect(process.env.JWT_SECRET).to.be.a('string').and.not.be.empty;
    });

    it('should load the EMAIL environment variable', () => {
        expect(process.env.EMAIL).to.be.a('string').and.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should load the EMAIL_PASSWORD environment variable', () => {
        expect(process.env.EMAIL_PASSWORD).to.be.a('string').and.not.be.empty;
    });

    it('should load the VAPID_PUBLIC_KEY environment variable', () => {
        expect(process.env.VAPID_PUBLIC_KEY).to.be.a('string').and.not.be.empty;
    });

    it('should load the VAPID_PRIVATE_KEY environment variable', () => {
        expect(process.env.VAPID_PRIVATE_KEY).to.be.a('string').and.not.be.empty;
    });

    it('should load the PORT environment variable as a number', () => {
        expect(parseInt(process.env.PORT)).to.be.a('number');
    });

    it('should load the LOG_LEVEL environment variable', () => {
        const validLogLevels = ['error', 'warn', 'info', 'debug'];
        expect(validLogLevels).to.include(process.env.LOG_LEVEL);
    });

    it('should load the NODE_ENV environment variable', () => {
        const validEnvironments = ['development', 'production', 'test'];
        expect(validEnvironments).to.include(process.env.NODE_ENV);
    });
});
