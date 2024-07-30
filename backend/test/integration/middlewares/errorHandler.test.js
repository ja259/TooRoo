import * as chai from 'chai';
import sinon from 'sinon';
import { errorHandler, notFound } from '../../../middlewares/errorHandler.js';

chai.should();

describe('Error Handler Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: sinon.stub().returns({ json: sinon.stub() })
        };
        next = sinon.stub();
    });

    describe('notFound', () => {
        it('should handle 404 errors correctly', () => {
            req.originalUrl = '/some/invalid/route';

            notFound(req, res, next);
            res.status.calledWith(404).should.be.true;
            next.calledOnce.should.be.true;
        });
    });

    describe('errorHandler', () => {
        it('should handle errors correctly', () => {
            const error = new Error('Test Error');
            error.statusCode = 400;

            errorHandler(error, req, res, next);
            res.status.calledWith(400).should.be.true;
            res.status().json.calledWithMatch({ message: 'Test Error' }).should.be.true;
        });

        it('should include stack trace in development mode', () => {
            process.env.NODE_ENV = 'development';
            const error = new Error('Test Error');

            errorHandler(error, req, res, next);
            res.status().json.calledWithMatch({ stack: error.stack }).should.be.true;
        });

        it('should not include stack trace in production mode', () => {
            process.env.NODE_ENV = 'production';
            const error = new Error('Test Error');

            errorHandler(error, req, res, next);
            res.status().json.calledWithMatch({ stack: '🥞' }).should.be.true;
        });
    });
});
