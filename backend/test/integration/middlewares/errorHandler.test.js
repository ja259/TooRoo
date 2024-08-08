import * as chai from 'chai';
import sinon from 'sinon';
import '../../setup.js';
import '../../teardown.js';
import * as errorHandler from '../../../middlewares/errorHandler.js';

const { expect } = chai;

describe('Error Handler Middleware Tests', () => {
    let req, res, next, err;

    beforeEach(() => {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
        err = new Error('Test error');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 404 for not found route', () => {
        errorHandler.notFound(req, res, next);
        expect(res.status.calledWith(404)).to.be.true;
        expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
    });

    it('should handle an error', () => {
        errorHandler.errorHandler(err, req, res, next);
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('message', 'Test error'))).to.be.true;
    });
});
