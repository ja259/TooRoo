import * as chai from 'chai';
import sinon from 'sinon';
import { getUserProfile } from '../../../controllers/userController.js';
import User from '../../../models/User.js';

const { expect } = chai;

describe('User Controller Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { params: { userId: '60d0fe4f5311236168a109ca' } };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should get user details', async () => {
        const user = { username: 'testuser' };
        sinon.stub(User, 'findById').returns({
            populate: sinon.stub().resolves(user)
        });

        await getUserProfile(req, res, next);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('user'))).to.be.true;
    });
});
