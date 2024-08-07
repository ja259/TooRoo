import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { connectDB, disconnectDB } from '../db.js';

chai.use(chaiHttp);

before(async () => {
    await connectDB();
});

after(async () => {
    await disconnectDB();
});
