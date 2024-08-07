import mongoose from 'mongoose';
import { disconnectDB } from '../db.js';

afterEach(async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany({});
    }
});

after(async () => {
    await disconnectDB();
});
