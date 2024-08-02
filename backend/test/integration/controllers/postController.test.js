import * as chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import mongoose from 'mongoose';
import app from '../../../server.js';
import User from '../../../models/User.js';
import Post from '../../../models/Post.js';
import { connectDB, disconnectDB } from '../../../db.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Post Controller Tests', () => {
    let postStub, userStub;

    before(async () => {
        await connectDB();
    });

    after(async () => {
        await disconnectDB();
    });

    beforeEach(() => {
        postStub = sinon.stub(Post.prototype, 'save').resolves();
        userStub = sinon.stub(User, 'findById').resolves(new User({ _id: 'userId', name: 'Test User' }));
    });

    afterEach(() => {
        postStub.restore();
        userStub.restore();
    });

    describe('POST /api/posts', () => {
        it('should create a new post', (done) => {
            const post = {
                title: 'Test Post',
                content: 'Post content'
            };

            chai.request(app)
                .post('/api/posts')
                .send(post)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message').eql('Post created successfully');
                    done();
                });
        });
    });
});
