import * as chai from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import * as userController from '../../controllers/userController.js';
import User from '../../models/User.js';

const { expect } = chai;

describe('User Controller', () => {
    describe('getUserProfile', () => {
        it('should get user profile', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(User, 'findById').returns({
                populate: sinon.stub().returnsThis(),
                exec: sinon.stub().resolves(true)
            });

            await userController.getUserProfile(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'User profile retrieved successfully'))).to.be.true;

            User.findById.restore();
        });
    });

    describe('updateUserProfile', () => {
        it('should update user profile', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() }, body: { username: 'updatedUsername' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(User, 'findByIdAndUpdate').resolves(true);

            await userController.updateUserProfile(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'User profile updated successfully.'))).to.be.true;

            User.findByIdAndUpdate.restore();
        });

        it('should return 400 if no update information provided', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() }, body: {} };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await userController.updateUserProfile(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Update information cannot be empty.' })).to.be.true;
        });
    });

    describe('followUser', () => {
        it('should follow a user', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() }, body: { userId: mongoose.Types.ObjectId() } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(User, 'findById').resolves({
                following: [],
                followers: [],
                save: sinon.stub().resolves()
            });

            await userController.followUser(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'Followed user successfully.'))).to.be.true;

            User.findById.restore();
        });

        it('should return 400 if userId is missing', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() }, body: {} };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await userController.followUser(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'User ID is required for following.' })).to.be.true;
        });
    });

    describe('unfollowUser', () => {
        it('should unfollow a user', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() }, body: { userId: mongoose.Types.ObjectId() } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(User, 'findById').resolves({
                following: [req.params.id],
                followers: [req.body.userId],
                save: sinon.stub().resolves()
            });

            await userController.unfollowUser(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'Unfollowed user successfully.'))).to.be.true;

            User.findById.restore();
        });

        it('should return 400 if userId is missing', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() }, body: {} };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await userController.unfollowUser(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'User ID is required for unfollowing.' })).to.be.true;
        });
    });
});
