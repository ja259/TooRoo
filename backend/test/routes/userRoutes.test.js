import * as chai from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import app from '../../app.js';
import * as userController from '../../controllers/userController.js';

const { expect } = chai;

describe('User Routes', () => {
    describe('GET /:id', () => {
        it('should call getUserProfile controller', async () => {
            const stub = sinon.stub(userController, 'getUserProfile').callsFake((req, res) => res.status(200).json({ message: 'User profile retrieved successfully' }));

            const res = await request(app).get('/api/users/60d5ec4c2f8fb814c89e0e78');

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('User profile retrieved successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('PUT /:id', () => {
        it('should call updateUserProfile controller', async () => {
            const stub = sinon.stub(userController, 'updateUserProfile').callsFake((req, res) => res.status(200).json({ message: 'User profile updated successfully.' }));

            const res = await request(app)
                .put('/api/users/60d5ec4c2f8fb814c89e0e78')
                .send({ username: 'updatedUsername' });

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('User profile updated successfully.');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('POST /:id/follow', () => {
        it('should call followUser controller', async () => {
            const stub = sinon.stub(userController, 'followUser').callsFake((req, res) => res.status(200).json({ message: 'Followed user successfully.' }));

            const res = await request(app)
                .post('/api/users/60d5ec4c2f8fb814c89e0e78/follow')
                .send({ userId: '60d5ec4c2f8fb814c89e0e78' });

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Followed user successfully.');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('POST /:id/unfollow', () => {
        it('should call unfollowUser controller', async () => {
            const stub = sinon.stub(userController, 'unfollowUser').callsFake((req, res) => res.status(200).json({ message: 'Unfollowed user successfully.' }));

            const res = await request(app)
                .post('/api/users/60d5ec4c2f8fb814c89e0e78/unfollow')
                .send({ userId: '60d5ec4c2f8fb814c89e0e78' });

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Unfollowed user successfully.');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });
});
