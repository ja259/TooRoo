import * as chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import server from '../../../server.js';
import config from '../../../config/config.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Post Routes Tests', () => {
    let token;

    before(() => {
        const userPayload = { id: '60d0fe4f5311236168a109ca', email: 'testuser@example.com' };
        token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '1h' });
    });

    it('should create a new post', (done) => {
        chai.request(server)
            .post('/api/posts')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'Test content', authorId: '60d0fe4f5311236168a109ca' })
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('message', 'Post created successfully');
                done();
            });
    });
});
