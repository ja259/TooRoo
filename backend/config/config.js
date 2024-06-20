require('dotenv').config();

const ENV = process.env.NODE_ENV || 'development';

const config = {
  development: {
    port: process.env.DEV_PORT || 5000,
    dbUri: process.env.DEV_MONGODB_URI,
    jwtSecret: process.env.DEV_JWT_SECRET,
    email: process.env.DEV_EMAIL,
    emailPassword: process.env.DEV_EMAIL_PASSWORD,
    emailService: process.env.DEV_EMAIL_SERVICE || 'Gmail' // Optional: specify email service provider
  },
  production: {
    port: process.env.PORT,
    dbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailService: process.env.EMAIL_SERVICE || 'Gmail' // Optional: specify email service provider
  }
}[ENV];

module.exports = config;

