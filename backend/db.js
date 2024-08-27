import mongoose from 'mongoose';
import config from './config/config.js';
import winston from 'winston';

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

const connectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    logger.info('Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(config.dbUri);
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (err) {
    logger.error(`Error disconnecting from MongoDB: ${err.message}`);
  }
};

// Graceful shutdown handler
const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    logger.info(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

// For nodemon restarts
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For app termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

export { connectDB, disconnectDB };
