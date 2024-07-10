import * as chai from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import app from '../../app.js';
import * as postController from '../../controllers/postController.js';

const { expect } = chai;

describe('Post Routes', () => {
    describe('POST /', () => {
        it('should call createPost controller', async () => {
            const stub = sinon.stub(postController, 'createPost').callsFake((req, res) => res.status(201).json({ message: 'Post created successfully' }));

            const res = await request(app)
                .post('/api/posts')
                .field('content', 'Test post')
                .field('authorId', '60d5ec4c2f8fb814c89e0e78')
                .attach('postImage', 'test/fixtures/testfile.jpg');

            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal('Post created successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('GET /', () => {
        it('should call getPosts controller', async () => {
            const stub = sinon.stub(postController, 'getPosts').callsFake((req, res) => res.status(200).json({ message: 'Posts retrieved successfully' }));

            const res = await request(app).get('/api/posts');

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Posts retrieved successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('PUT /:id/like', () => {
        it('should call likePost controller', async () => {
            const stub = sinon.stub(postController, 'likePost').callsFake((req, res) => res.status(200).json({ message: 'Like status updated successfully' }));

            const res = await request(app)
                .put('/api/posts/60d5ec4c2f8fb814c89e0e78/like')
                .send({ userId: '60d5ec4c2f8fb814c89e0e78' });

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Like status updated successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('POST /:id/comment', () => {
        it('should call commentOnPost controller', async () => {
            const stub = sinon.stub(postController, 'commentOnPost').callsFake((req, res) => res.status(201).json({ message: 'Comment added successfully' }));

            const res = await request(app)
                .post('/api/posts/60d5ec4c2f8fb814c89e0e78/comment')
                .send({ userId: '60d5ec4c2f8fb814c89e0e78', content: 'Test comment' });

            expect(res.status).to.equal(201);
            expect(res.body.message).to.equal('Comment added successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });

    describe('DELETE /:id', () => {
        it('should call deletePost controller', async () => {
            const stub = sinon.stub(postController, 'deletePost').callsFake((req, res) => res.status(200).json({ message: 'Post deleted successfully' }));

            const res = await request(app).delete('/api/posts/60d5ec4c2f8fb814c89e0e78');

            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Post deleted successfully');
            expect(stub.calledOnce).to.be.true;

            stub.restore();
        });
    });
});
