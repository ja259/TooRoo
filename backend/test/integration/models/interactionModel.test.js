import * as chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import server from '../../../server.js';
import Interaction from '../../../models/Interaction.js';
import { connectDB, disconnectDB } from '../../../db.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Interaction Model Integration Tests', () => {
    before(async () => {
        await connectDB();
    });

    after(async () => {
        await disconnectDB();
    });

    beforeEach(async () => {
        await Interaction.deleteMany({});
    });

    it('should create an interaction', (done) => {
        const interaction = {
            userId: mongoose.Types.ObjectId(),
            postId: mongoose.Types.ObjectId(),
            type: 'like'
        };

        chai.request(server)
            .post('/api/interactions')
            .send(interaction)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'Interaction created successfully');
                done();
            });
    });

    it('should not create an interaction without a required field', (done) => {
        const interaction = {
            postId: mongoose.Types.ObjectId(),
            type: 'like'
        };

        chai.request(server)
            .post('/api/interactions')
            .send(interaction)
            .end((err, res) => {
                expect(res).to.have.status(422);
                expect(res.body).to.have.property('errors');
                done();
            });
    });
});
