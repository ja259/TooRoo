import chai from 'chai';
import sinon from 'sinon';
import { errorHandler } from '../../../middlewares/errorHandler.js';

const { expect } = chai;

describe('Error Handler Middleware Tests', () => {
    it('should handle an error', () => {
        const err = new Error('Test error');
        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        const next = sinon.stub();

        errorHandler(err, req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith(sinon.match({ message: 'Test error' }))).to.be.true;
    });
});
