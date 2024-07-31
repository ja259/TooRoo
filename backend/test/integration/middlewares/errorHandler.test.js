import * as chai from 'chai';
import sinon from 'sinon';
import { notFound, errorHandler } from '../../../middlewares/errorHandler.js';

const { expect } = chai;

describe('Error Handler Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = { status: sinon.stub().returns({ json: sinon.stub() }) };
        next = sinon.stub();
    });

    describe('notFound', () => {
        it('should return 404 for not found route', () => {
            notFound(req, res, next);
            res.status.calledWith(404).should.be.true;
            res.status().json.calledWith({ message: 'Not Found' }).should.be.true;
        });
    });

    describe('errorHandler', () => {
        it('should handle an error', () => {
            const err = new Error('Test error');
            err.status = 500;

            errorHandler(err, req, res, next);
            res.status.calledWith(500).should.be.true;
            res.status().json.calledWith({
                message: err.message,
                stack: process.env.NODE_ENV === 'production' ? null : err.stack
            }).should.be.true;
        });

        it('should handle an error without status', () => {
            const err = new Error('Test error');

            errorHandler(err, req, res, next);
            res.status.calledWith(500).should.be.true;
            res.status().json.calledWith({
                message: err.message,
                stack: process.env.NODE_ENV === 'production' ? null : err.stack
            }).should.be.true;
        });
    });
});
