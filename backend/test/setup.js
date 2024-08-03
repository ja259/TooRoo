import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../../db.js';

before(async () => {
    await connectDB();
});

after(async () => {
    await disconnectDB();
});
