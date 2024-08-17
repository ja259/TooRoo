import { connectDB } from '../db.js';
import mongoose from 'mongoose';

// Hook to run before all tests
before(async () => {
    await connectDB();
});

// Hook to run after each test to clean up database collections
afterEach(async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany({});
    }
});
