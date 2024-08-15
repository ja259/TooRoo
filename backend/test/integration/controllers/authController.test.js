import * as chai from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcryptjs'; // Import bcrypt to simulate hashing
import { login } from '../../../controllers/authController.js';
import User from '../../../models/User.js';

const { expect } = chai;

describe('Auth Controller Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should login an existing user', async () => {
        req.body = { emailOrPhone: 'testuser@example.com', password: 'password123' };

        // Simulate the hashing process
        const hashedPassword = await bcrypt.hash('password123', 10);

        const user = {
            password: hashedPassword, // Use the hashed password in the simulation
            comparePassword: function (inputPassword) {
                return bcrypt.compare(inputPassword, this.password);
            },
            generateAuthToken: sinon.stub().returns('token')
        };
        sinon.stub(User, 'findOne').returns({ select: sinon.stub().resolves(user) });

        await login(req, res, next);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('token'))).to.be.true;
    });

    it('should not login a user with incorrect password', async () => {
        req.body = { emailOrPhone: 'testuser@example.com', password: 'wrongpassword' };

        // Simulate the hashing process
        const hashedPassword = await bcrypt.hash('password123', 10);

        const user = {
            password: hashedPassword, // Use the hashed password in the simulation
            comparePassword: function (inputPassword) {
                return bcrypt.compare(inputPassword, this.password);
            }
        };
        sinon.stub(User, 'findOne').returns({ select: sinon.stub().resolves(user) });

        await login(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith(sinon.match.has('message'))).to.be.true;
    });
});
