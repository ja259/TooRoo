import dotenv from 'dotenv';

dotenv.config();

const ENV = process.env.NODE_ENV || 'development';

const validateConfig = (config) => {
    const requiredVars = ['dbUri', 'jwtSecret', 'email', 'emailPassword', 'vapidPublicKey', 'vapidPrivateKey'];
    requiredVars.forEach((varName) => {
        if (!config[varName]) {
            throw new Error(`Missing required environment variable: ${varName}`);
        }
    });
};

const defaultConfig = {
    port: 5000,
    emailService: 'Gmail'
};

const developmentConfig = {
    port: process.env.DEV_PORT || defaultConfig.port,
    dbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailService: process.env.EMAIL_SERVICE || defaultConfig.emailService,
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY
};

const productionConfig = {
    port: process.env.PORT,
    dbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailService: process.env.EMAIL_SERVICE || defaultConfig.emailService,
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY
};

const config = ENV === 'production' ? productionConfig : developmentConfig;

validateConfig(config);

export default config;

