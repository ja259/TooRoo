import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http/index.js';
import { connectDB, disconnectDB } from '../db.js';

chai.use(chaiHttp);

before(async () => {
    await connectDB();
});

after(async () => {
    await disconnectDB();
});
