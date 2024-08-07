import { disconnectDB } from '../db.js';
import mongoose from 'mongoose';

after(async () => {
    await disconnectDB();
});

afterEach(async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany({});
    }
});
