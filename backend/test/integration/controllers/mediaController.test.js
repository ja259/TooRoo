import * as chai from 'chai';
import sinon from 'sinon';
import '../../setup.js';
import '../../teardown.js';
import * as mediaController from '../../../controllers/mediaController.js';
import Video from '../../../models/Video.js';

const { expect } = chai;

describe('Media Controller Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, file: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should upload a media file', async () => {
        req.file = { filename: 'testfile.mp4' };
        req.body = { description: 'Test video', authorId: 'validAuthorId' };

        sinon.stub(Video.prototype, 'save').resolves({});

        await mediaController.uploadVideo(req, res, next);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('message', 'Video uploaded successfully'))).to.be.true;
    });
});
