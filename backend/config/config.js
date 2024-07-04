require('dotenv').config();

const ENV = process.env.NODE_ENV || 'development';

const validateConfig = (config) => {
    const requiredVars = ['dbUri', 'jwtSecret', 'email', 'emailPassword'];
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
    dbUri: process.env.DEV_MONGODB_URI,
    jwtSecret: process.env.DEV_JWT_SECRET,
    email: process.env.DEV_EMAIL,
    emailPassword: process.env.DEV_EMAIL_PASSWORD,
    emailService: process.env.DEV_EMAIL_SERVICE || defaultConfig.emailService
};

const productionConfig = {
    port: process.env.PORT,
    dbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailService: process.env.EMAIL_SERVICE || defaultConfig.emailService
};

const config = ENV === 'production' ? productionConfig : developmentConfig;

validateConfig(config);

module.exports = config;

