import * as chai from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import app from '../../../server.js';
import Interaction from '../../../models/Interaction.js';
import { connectDB, disconnectDB } from '../../../db.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Interaction Model Integration Tests', () => {
    let interactionStub;

    before(async () => {
        await connectDB();
    });

    after(async () => {
        await disconnectDB();
    });

    beforeEach(() => {
        interactionStub = sinon.stub(Interaction.prototype, 'save').resolves();
    });

    afterEach(() => {
        interactionStub.restore();
    });

    it('should create an interaction', (done) => {
        const interaction = {
            userId: 'userId',
            postId: 'postId',
            type: 'like'
        };

        chai.request(app)
            .post('/api/interactions')
            .send(interaction)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message').eql('Interaction created successfully');
                done();
            });
    });

    it('should not create an interaction without a required field', (done) => {
        const interaction = {
            postId: 'postId',
            type: 'like'
        };

        chai.request(app)
            .post('/api/interactions')
            .send(interaction)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').eql('User ID is required');
                done();
            });
    });
});
