import * as chai from 'chai';
import sinon from 'sinon';
import User from '../../../models/User.js';
import * as userController from '../../../controllers/userController.js';

const { expect } = chai;

describe('User Controller Tests', () => {
    let req, res, sandbox, authToken;

    before(async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        authToken = user.generateAuthToken();
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = { headers: { authorization: `Bearer ${authToken}` } };
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub(),
            send: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should get user details', async () => {
        await userController.getUserDetails(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });
});
