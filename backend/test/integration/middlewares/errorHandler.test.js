import * as chai from 'chai';
import sinon from 'sinon';
import { notFound, errorHandler } from '../../../middlewares/errorHandler.js'; // Import named exports

const { expect } = chai;

describe('Error Handler Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
        next = sinon.stub();
    });

    describe('notFound', () => {
        it('should return 404 for not found route', () => {
            notFound(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'Route not found' })).to.be.true;
        });
    });

    describe('errorHandler', () => {
        it('should handle an error', () => {
            const error = new Error('Test error');
            errorHandler(error, req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Test error' })).to.be.true;
        });

        it('should handle an error without status', () => {
            const error = { message: 'Test error' };
            errorHandler(error, req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Test error' })).to.be.true;
        });
    });
});
