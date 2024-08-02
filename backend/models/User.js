import mongoose from 'mongoose';

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
    avatar: String,
    securityQuestions: [securityQuestionSchema],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
