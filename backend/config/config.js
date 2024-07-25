import dotenv from 'dotenv';

// Load environment variables from .env file
console.log("Loading environment variables...");
dotenv.config();
console.log("Loaded Environment Variables:", process.env);

const ENV = process.env.NODE_ENV || 'development';

const validateConfig = (config) => {
    const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'EMAIL', 'EMAIL_PASSWORD', 'VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY'];
    requiredVars.forEach((varName) => {
        console.log(`Validating: ${varName}, Value: ${config[varName]}`);
        if (!config[varName]) {
            throw new Error(`Missing required environment variable: ${varName}`);
        }
    });
};

const config = {
    port: process.env.PORT || 5000,
    dbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailService: process.env.EMAIL_SERVICE || 'Gmail',
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY
};

// Print the config object for debugging
console.log("Config Object before validation:", config);

validateConfig(config);

export default config;
