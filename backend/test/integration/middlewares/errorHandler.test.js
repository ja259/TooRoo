import * as chai from 'chai';
import '../../setup.js';
import '../../teardown.js';
import app from '../../../server.js';

const { expect } = chai;

describe('Error Handler Middleware Tests', () => {
    it('should return 404 for not found route', (done) => {
        chai.request(app)
            .get('/api/nonexistent-route')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should handle an error', (done) => {
        chai.request(app)
            .get('/api/route-that-throws-error')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('should handle an error without status', (done) => {
        chai.request(app)
            .get('/api/route-that-throws-error-without-status')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });
});
