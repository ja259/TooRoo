import mongoose from 'mongoose';
import config from './config/config.js';

const connectDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        console.log('Already connected to MongoDB');
        return;
    }

    try {
        console.log('Attempting to connect to MongoDB with URI:', config.dbUri);
        await mongoose.connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (err) {
        console.error('Error disconnecting from MongoDB:', err);
    }
};

export { connectDB, disconnectDB };
