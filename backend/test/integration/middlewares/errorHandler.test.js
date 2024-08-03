import * as chai from 'chai';
import sinon from 'sinon';
import { notFound, errorHandler } from '../../../middlewares/errorHandler.js';

const { expect } = chai;

describe('Error Handler Middleware Tests', () => {
    it('should return 404 for not found route', (done) => {
        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };

        notFound(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Not Found' })).to.be.true;
        done();
    });

    it('should handle an error', (done) => {
        const err = new Error('Test error');
        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
        const next = sinon.spy();

        errorHandler(err, req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: 'Server Error' })).to.be.true;
        done();
    });

    it('should handle an error without status', (done) => {
        const err = {};
        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
        const next = sinon.spy();

        errorHandler(err, req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: 'Server Error' })).to.be.true;
        done();
    });
});
