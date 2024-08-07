import mongoose from 'mongoose';
import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { connectDB } from '../db.js';

chai.use(chaiHttp);

before(async () => {
    await connectDB();
});
