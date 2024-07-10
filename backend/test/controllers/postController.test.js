import * as chai from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import * as postController from '../../controllers/postController.js';
import Post from '../../models/Post.js';
import User from '../../models/User.js';

const { expect } = chai;

describe('Post Controller', () => {
    describe('createPost', () => {
        it('should create a new post', async () => {
            const req = {
                body: { content: 'Test post', authorId: mongoose.Types.ObjectId() },
                file: { filename: 'testfile.jpg' }
            };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(User, 'findById').resolves({ _id: mongoose.Types.ObjectId(), posts: [], save: sinon.stub().resolves() });
            sinon.stub(Post.prototype, 'save').resolves();

            await postController.createPost(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'Post created successfully'))).to.be.true;

            User.findById.restore();
            Post.prototype.save.restore();
        });

        it('should return 400 if content or authorId is missing', async () => {
            const req = { body: {} };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await postController.createPost(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Content and author ID are required.' })).to.be.true;
        });
    });

    describe('getPosts', () => {
        it('should get all posts', async () => {
            const req = {};
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(Post, 'find').returns({
                populate: sinon.stub().returnsThis(),
                exec: sinon.stub().resolves([])
            });

            await postController.getPosts(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'No posts found.' })).to.be.true;

            Post.find.restore();
        });
    });

    describe('likePost', () => {
        it('should like a post', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() }, body: { userId: mongoose.Types.ObjectId() } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(Post, 'findById').resolves({
                likes: [],
                save: sinon.stub().resolves()
            });

            await postController.likePost(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'Like status updated successfully'))).to.be.true;

            Post.findById.restore();
        });

        it('should return 400 if userId is missing', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() }, body: {} };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await postController.likePost(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'User ID is required.' })).to.be.true;
        });
    });

    describe('commentOnPost', () => {
        it('should add a comment to a post', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() }, body: { userId: mongoose.Types.ObjectId(), content: 'Test comment' } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(Post, 'findById').resolves({
                comments: [],
                save: sinon.stub().resolves()
            });

            await postController.commentOnPost(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(sinon.match.has('message', 'Comment added successfully'))).to.be.true;

            Post.findById.restore();
        });

        it('should return 400 if content is missing', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() }, body: { userId: mongoose.Types.ObjectId() } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            await postController.commentOnPost(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Content is required for the comment.' })).to.be.true;
        });
    });

    describe('deletePost', () => {
        it('should delete a post', async () => {
            const req = { params: { id: mongoose.Types.ObjectId() } };
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

            sinon.stub(Post, 'findByIdAndRemove').resolves(true);

            await postController.deletePost(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Post deleted successfully' })).to.be.true;

            Post.findByIdAndRemove.restore();
        });
    });
});
