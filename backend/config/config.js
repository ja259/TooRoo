import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const config = {
    port: process.env.PORT || 5000,
    dbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    emailService: process.env.EMAIL_SERVICE,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
    gridFsBucket: process.env.GRIDFS_BUCKET || 'uploads',
    googleApiKey: process.env.GOOGLE_API_KEY,
    stripeApiKey: process.env.STRIPE_API_KEY,
    corsOrigins: process.env.CORS_ORIGIN.split(','),
    logLevel: process.env.LOG_LEVEL || 'info',
    nodeEnv: process.env.NODE_ENV || 'development',
    testEmailRecipient: process.env.TEST_EMAIL_RECIPIENT,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
};

export default config;
