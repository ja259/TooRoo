import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (err) {
      console.error('Error disconnecting from MongoDB:', err);
    }
  }
};

export { connectDB, disconnectDB };
