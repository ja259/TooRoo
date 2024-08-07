import * as chai from 'chai';
import sinon from 'sinon';
import * as errorHandler from '../../../middlewares/errorHandler.js';

const { expect } = chai;

describe('Error Handler Middleware Tests', () => {
    let req, res, next, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {};
        res = {
            status: sandbox.stub().returnsThis(),
            json: sandbox.stub(),
            send: sandbox.stub()
        };
        next = sandbox.stub();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return 404 for not found route', async () => {
        req.path = '/non-existent-route';
        await errorHandler.notFound(req, res, next);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.send.calledOnce).to.be.true;
    });

    it('should handle an error', async () => {
        const error = new Error('Test error');
        await errorHandler.errorHandler(error, req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });

    it('should handle an error without status', async () => {
        const error = new Error('Test error');
        error.status = undefined;
        await errorHandler.errorHandler(error, req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
    });
});
