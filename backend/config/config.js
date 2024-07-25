import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get __filename and __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../../.env');
console.log(`Loading environment variables from: ${envPath}`);
dotenv.config({ path: envPath });

// Print all loaded environment variables
console.log("Loaded Environment Variables:", process.env);

// Extract and log individual variables to ensure they are correctly loaded
const config = {
    port: process.env.PORT,
    dbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailService: process.env.EMAIL_SERVICE,
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
};

// Log the config object for debugging
console.log("Config Object:", config);

export default config;
