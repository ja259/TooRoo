import * as chai from 'chai';
import sinon from 'sinon';
import '../../setup.js';
import '../../teardown.js';
import * as userController from '../../../controllers/userController.js';
import User from '../../../models/User.js';

const { expect } = chai;

describe('User Controller Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, params: {} };
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
        req.params.id = 'validUserId';

        const user = new User({ _id: 'validUserId' });
        sinon.stub(User, 'findById').resolves(user);

        await userController.getUserProfile(req, res, next);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('message', 'User profile retrieved successfully'))).to.be.true;
    });
});
