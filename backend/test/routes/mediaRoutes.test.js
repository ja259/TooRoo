import * as chai from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import app from '../../app.js';
import * as mediaController from '../../controllers/mediaController.js';

const { expect } = chai;

describe('Media Routes', () => {
    describe('POST /upload', () => {
        it('should call uploadVideo controller', async () => {
            const stub = sinon.stub(mediaController, 'uploadVideo').callsFake((req, res) => res.status(201).json({ message: 'Video uploaded successfully' }));

            const res = await request(app)
                .post('/api/media/upload')
                .attach('video', 'test/fixtures/testfile.mp4')
                .field('description', 'Test video')
                .field('authorId', '60d5ec4c2f8fb814c89e0e78');

            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal('Video uploaded successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('GET /you-all-videos', () => {
        it('should call getAllVideos controller', async () => {
            const stub = sinon.stub(mediaController, 'getAllVideos').callsFake((req, res) => res.status(200).json({ message: 'Videos retrieved successfully' }));

            const res = await request(app).get('/api/media/you-all-videos');

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Videos retrieved successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('DELETE /:id', () => {
        it('should call deleteVideo controller', async () => {
            const stub = sinon.stub(mediaController, 'deleteVideo').callsFake((req, res) => res.status(200).json({ message: 'Video deleted successfully' }));

            const res = await request(app).delete('/api/media/60d5ec4c2f8fb814c89e0e78');

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Video deleted successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('PUT /:id', () => {
        it('should call updateVideo controller', async () => {
            const stub = sinon.stub(mediaController, 'updateVideo').callsFake((req, res) => res.status(200).json({ message: 'Video updated successfully' }));

            const res = await request(app)
                .put('/api/media/60d5ec4c2f8fb814c89e0e78')
                .send({ description: 'Updated description' });

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Video updated successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });
});
