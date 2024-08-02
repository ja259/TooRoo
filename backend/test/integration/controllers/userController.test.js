import * as chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import mongoose from 'mongoose';
import app from '../../../server.js';
import User from '../../../models/User.js';
import { connectDB, disconnectDB } from '../../../db.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('User Controller Tests', () => {
    let userStub;

    before(async () => {
        await connectDB();
    });

    after(async () => {
        await disconnectDB();
    });

    beforeEach(() => {
        userStub = sinon.stub(User, 'findById').resolves(new User({ _id: 'userId', name: 'Test User' }));
    });

    afterEach(() => {
        userStub.restore();
    });

    describe('GET /api/users/:id', () => {
        it('should get a user by id', (done) => {
            chai.request(app)
                .get('/api/users/userId')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('name').eql('Test User');
                    done();
                });
        });
    });
});
