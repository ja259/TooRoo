import * as chai from 'chai';
import chaiHttp from 'chai-http';
import express from 'express';
import { errorHandler, notFound } from '../../../middlewares/errorHandler.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Error Handler Middleware Tests', () => {
    let app;

    before(() => {
        app = express();

        app.get('/test/not-found', (req, res, next) => {
            notFound(req, res, next);
        });

        app.get('/test/error', (req, res, next) => {
            const error = new Error('Test error');
            next(error);
        });

        app.use(errorHandler);
    });

    it('should return 404 for not found route', (done) => {
        chai.request(app)
            .get('/test/not-found')
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('message').that.includes('Not Found');
                done();
            });
    });

    it('should handle an error', (done) => {
        chai.request(app)
            .get('/test/error')
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message', 'Test error');
                done();
            });
    });

    it('should handle an error without status', (done) => {
        chai.request(app)
            .get('/test/error')
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('message', 'Test error');
                done();
            });
    });
});
