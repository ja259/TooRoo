import * as chai from 'chai';
import { notFound, errorHandler } from '../../../middlewares/errorHandler.js';

const { expect } = chai;

describe('Error Handler Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    describe('notFound', () => {
        it('should return 404 for not found route', () => {
            notFound(req, res, next);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'Not Found' })).to.be.true;
        });
    });

    describe('errorHandler', () => {
        it('should handle an error', () => {
            const err = new Error('Test Error');
            errorHandler(err, req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Test Error' })).to.be.true;
        });

        it('should handle an error without status', () => {
            const err = new Error('Test Error');
            delete err.status;
            errorHandler(err, req, res, next);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Test Error' })).to.be.true;
        });
    });
});
