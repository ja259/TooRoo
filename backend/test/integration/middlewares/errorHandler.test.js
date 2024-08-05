import '../../setup.js';
import '../../teardown.js';
import * as chai from 'chai';
import chaiHttp from 'chai-http/index.js';
import app from '../../../server.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Error Handler Middleware Tests', () => {
    it('should return 404 for not found route', (done) => {
        chai.request(app)
            .get('/api/unknown-route')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should handle an error', (done) => {
        chai.request(app)
            .get('/api/error-route')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });

    it('should handle an error without status', (done) => {
        chai.request(app)
            .get('/api/error-route-without-status')
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    });
});
