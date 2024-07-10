import * as chai from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import * as mediaController from '../../controllers/mediaController.js';
import Video from '../../models/Video.js';

const { expect } = chai;

describe('Media Controller', () => {
    describe('uploadVideo', () => {
        it('should upload a video', async () => {
            const req = {
                file: { filename: 'testfile.mp4' },
                body: { description: 'Test video', authorId: mongoose.Types.ObjectId() }
            };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(Video.prototype, 'save').resolves();

            await mediaController.uploadVideo(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'Video uploaded successfully'))).to.be.true;

            Video.prototype.save.restore();
        });

        it('should return 400 if no file provided', async () => {
            const req = { file: null };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await mediaController.uploadVideo(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'No file provided' })).to.be.true;
        });
    });

    describe('getAllVideos', () => {
        it('should get all videos', async () => {
            const req = {};
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(Video, 'find').returns({
                populate: sinon.stub().returnsThis(),
                exec: sinon.stub().resolves([])
            });

            await mediaController.getAllVideos(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'No videos found' })).to.be.true;

            Video.find.restore();
        });
    });

    describe('deleteVideo', () => {
        it('should delete a video', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(Video, 'findByIdAndRemove').resolves(true);

            await mediaController.deleteVideo(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Video deleted successfully' })).to.be.true;

            Video.findByIdAndRemove.restore();
        });
    });

    describe('updateVideo', () => {
        it('should update a video description', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() }, body: { description: 'Updated description' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(Video, 'findByIdAndUpdate').resolves(true);

            await mediaController.updateVideo(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'Video updated successfully'))).to.be.true;

            Video.findByIdAndUpdate.restore();
        });
    });
});
