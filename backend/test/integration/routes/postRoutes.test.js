import * as chai from 'chai';
import sinon from 'sinon';
import User from '../../../models/User.js';
import * as postController from '../../../controllers/postController.js';

const { expect } = chai;

describe('Post Routes Tests', () => {
    let req, res, sandbox, authToken;

    before(async () => {
        const user = new User({ username: 'testuser', email: 'testuser@example.com', phone: '1234567890', password: 'password123' });
        await user.save();
        authToken = user.generateAuthToken();
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = { headers: { authorization: `Bearer ${authToken}` }, body: { content: 'This is a new post' } };
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub(),
            send: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should create a new post', async () => {
        await postController.createPost(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });
});
