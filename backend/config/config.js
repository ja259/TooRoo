import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get __filename and __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
console.log("Loading environment variables...");
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
console.log("Loaded Environment Variables:", process.env);

const ENV = process.env.NODE_ENV || 'development';

const validateConfig = (config) => {
    const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'EMAIL', 'EMAIL_PASSWORD', 'VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY'];
    requiredVars.forEach((varName) => {
        console.log(`Validating: ${varName}, Value: ${config[varName]}`);
        if (!config[varName]) {
            console.error(`Missing value for ${varName}`);
            throw new Error(`Missing required environment variable: ${varName}`);
        }
    });
};

const defaultConfig = {
    port: 5000,
    emailService: 'Gmail'
};

const developmentConfig = {
    port: process.env.PORT || defaultConfig.port,
    dbUri: process.env.MONGODB_URI || 'mongodb+srv://fallback_uri/test',  // Temporary fallback for debugging
    jwtSecret: process.env.JWT_SECRET,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailService: process.env.EMAIL_SERVICE || defaultConfig.emailService,
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY
};

const productionConfig = {
    port: process.env.PORT,
    dbUri: process.env.MONGODB_URI || 'mongodb+srv://fallback_uri/test',  // Temporary fallback for debugging
    jwtSecret: process.env.JWT_SECRET,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailService: process.env.EMAIL_SERVICE || defaultConfig.emailService,
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY
};

const config = ENV === 'production' ? productionConfig : developmentConfig;

// Print the config object for debugging
console.log("Config Object before validation:", config);

// Additional logging for MONGODB_URI
console.log(`MONGODB_URI before validation: ${process.env.MONGODB_URI}`);
console.log(`MONGODB_URI in config: ${config.dbUri}`);

validateConfig(config);

export default config;
