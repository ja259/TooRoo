import * as chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../server.js';
import User from '../../../models/User.js';
import Post from '../../../models/Post.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Post Routes Tests', () => {
    let userToken;
    let userId;
    let postId;

    before(async () => {
        await User.deleteMany();
        await Post.deleteMany();

        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            phone: '1234567890',
            password: 'password123',
            securityQuestions: [
                { question: 'First pet?', answer: 'Fluffy' },
                { question: 'Mother\'s maiden name?', answer: 'Smith' },
                { question: 'Favorite color?', answer: 'Blue' }
            ]
        });
        await user.save();
        userToken = user.generateAuthToken();
        userId = user._id;
    });

    it('should create a new post', (done) => {
        chai.request(server)
            .post('/api/posts')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ content: 'Test Post', authorId: userId })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'Post created successfully');
                postId = res.body.post._id;
                done();
            });
    });

    it('should get all posts', (done) => {
        chai.request(server)
            .get('/api/posts')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Posts retrieved successfully');
                done();
            });
    });

    it('should like a post', (done) => {
        chai.request(server)
            .put(`/api/posts/${postId}/like`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ userId })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Like status updated successfully');
                done();
            });
    });

    it('should comment on a post', (done) => {
        chai.request(server)
            .post(`/api/posts/${postId}/comment`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ userId, content: 'Test Comment' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Comment added successfully');
                done();
            });
    });

    it('should delete a post', (done) => {
        chai.request(server)
            .delete(`/api/posts/${postId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Post deleted successfully');
                done();
            });
    });
});
