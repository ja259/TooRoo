import * as chai from 'chai';
import sinon from 'sinon';
import '../../setup.js';
import '../../teardown.js';
import * as postController from '../../../controllers/postController.js';
import Post from '../../../models/Post.js';
import User from '../../../models/User.js';

const { expect } = chai;

describe('Post Controller Tests', () => {
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

    it('should create a new post', async () => {
        req.body = { content: 'Test content', authorId: 'validAuthorId' };
        req.file = { filename: 'testfile.mp4' };

        const user = new User({ _id: 'validAuthorId', posts: [] });
        sinon.stub(User, 'findById').resolves(user);
        sinon.stub(Post.prototype, 'save').resolves({});
        sinon.stub(user, 'save').resolves(user);

        await postController.createPost(req, res, next);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('message', 'Post created successfully'))).to.be.true;
    });
});
