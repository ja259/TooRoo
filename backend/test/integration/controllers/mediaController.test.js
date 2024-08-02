import * as chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import mongoose from 'mongoose';
import app from '../../../server.js';
import User from '../../../models/User.js';
import Media from '../../../models/Media.js';
import { connectDB, disconnectDB } from '../../../db.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Media Controller Tests', () => {
    let mediaStub, userStub;

    before(async () => {
        await connectDB();
    });

    after(async () => {
        await disconnectDB();
    });

    beforeEach(() => {
        mediaStub = sinon.stub(Media.prototype, 'save').resolves();
        userStub = sinon.stub(User, 'findById').resolves(new User({ _id: 'userId', name: 'Test User' }));
    });

    afterEach(() => {
        mediaStub.restore();
        userStub.restore();
    });

    describe('POST /api/media/upload', () => {
        it('should upload a media file', (done) => {
            const media = {
                title: 'Test Media',
                description: 'Media description',
                file: 'testfile.png'
            };

            chai.request(app)
                .post('/api/media/upload')
                .send(media)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message').eql('Media uploaded successfully');
                    done();
                });
        });
    });
});
