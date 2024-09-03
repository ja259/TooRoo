import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const securityQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    bio: String,
    profilePicture: String,
    securityQuestions: [securityQuestionSchema],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    darkMode: { type: Boolean, default: false },
    enable2FA: { type: Boolean, default: false },
    preferred2FAMethod: { type: String, enum: ['email', 'sms', 'both'], default: 'email' },
    twoFactorCode: { type: String, select: false },
    twoFactorExpires: { type: Date, select: false },
    newUser: { type: Boolean, default: true }
}, { timestamps: true });

// Generate auth token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, username: this.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    return token;
};

const User = mongoose.model('User', userSchema);

export default User;
